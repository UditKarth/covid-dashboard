import puppeteer from 'puppeteer'
import { CovidStats, RegionData } from '../types/covid'
import { worldCountries } from '../data/regions'

// Add a type for the progress callback
type ProgressCallback = (data: RegionData[], progress: { 
  total: number, 
  current: number, 
  country?: string 
}) => void

const BATCH_SIZE = 5 // Number of concurrent requests

export async function scrapeWHOData(
  onProgress?: ProgressCallback
): Promise<RegionData[]> {
  try {
    console.log('Launching browser...')
    const browser = await puppeteer.launch({
      headless: 'new',
    })

    // Create a pool of pages
    const pages = await Promise.all(
      Array(BATCH_SIZE).fill(null).map(() => browser.newPage())
    )
    
    // First get global data for both cases and deaths
    console.log('Fetching global data...')
    const globalCases = await fetchPageData(pages[0], 'https://data.who.int/dashboards/covid19/cases?n=c')
    const globalDeaths = await fetchPageData(pages[0], 'https://data.who.int/dashboards/covid19/deaths?n=c')

    const stats: CovidStats[] = [{
      id: 'world-global',
      name: 'Global',
      code: 'GLOBAL',
      confirmed: globalCases.confirmed || 0,
      deaths: globalDeaths.confirmed || 0,
      weeklyIncrease: globalCases.weeklyIncrease || 0
    }]

    // Notify of initial global data
    onProgress?.([{
      name: 'world',
      stats: stats
    }], { total: 180, current: 1 })

    // Generate country IDs (004 to 716, step by 4)
    const countryIds = Array.from({ length: 179 }, (_, i) => String(4 + i * 4).padStart(3, '0'))

    // Create a mapping of indices to countries
    const countryMapping = worldCountries.reduce((acc, country, index) => {
      acc[index] = country
      return acc
    }, {} as Record<number, typeof worldCountries[0]>)

    // Process countries in batches
    for (let i = 0; i < countryIds.length; i += BATCH_SIZE) {
      const batch = countryIds.slice(i, i + BATCH_SIZE)
      const batchPromises = batch.map(async (id, batchIndex) => {
        const page = pages[batchIndex]
        const countryIndex = i + batchIndex
        const country = countryMapping[countryIndex]

        if (!country) return null

        try {
          console.log(`Fetching data for ${country.name} (ID: ${id})`)
          
          // Fetch both cases and deaths for the country
          const casesUrl = `https://data.who.int/dashboards/covid19/cases?m49=${id}&n=c`
          const deathsUrl = `https://data.who.int/dashboards/covid19/deaths?m49=${id}&n=c`
          
          const casesData = await fetchPageData(page, casesUrl)
          const deathsData = await fetchPageData(page, deathsUrl)

          return {
            id: `world-${country.code.toLowerCase()}`,
            name: country.name,
            code: country.code,
            confirmed: casesData.confirmed || 0,
            deaths: deathsData.confirmed || 0,
            weeklyIncrease: casesData.weeklyIncrease || 0
          }
        } catch (error) {
          console.error(`Error fetching data for ${country.name}:`, error)
          return null
        }
      })

      // Wait for all countries in the batch to complete
      const batchResults = await Promise.all(batchPromises)
      const validResults = batchResults.filter((result): result is CovidStats => result !== null)
      
      // Add valid results to stats
      stats.push(...validResults)

      // Update progress
      onProgress?.([{
        name: 'world',
        stats: stats
      }], {
        total: countryIds.length + 1,
        current: Math.min(i + BATCH_SIZE + 1, countryIds.length + 1),
        country: validResults[validResults.length - 1]?.name
      })

      // Small delay between batches to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Close all pages and the browser
    await Promise.all(pages.map(page => page.close()))
    await browser.close()
    console.log('Browser closed')
    console.log(`Successfully scraped data for ${stats.length} countries`)

    return [{
      name: 'world',
      stats: stats
    }]

  } catch (error) {
    console.error('Error scraping WHO data:', error)
    return [{
      name: 'world',
      stats: []
    }]
  }
}

async function fetchPageData(page: puppeteer.Page, url: string) {
  await page.goto(url, { waitUntil: 'networkidle0' })
  
  // Wait for either data or no-data message
  await Promise.race([
    page.waitForSelector('[data-testid="dataDotViz-epiRollingFactoid-value"]', { timeout: 5000 }),
    page.waitForSelector('[data-testid="dataDotViz-epiRollingFactoid-nodata"]', { timeout: 5000 })
  ])
  
  return extractPageData(page)
}

async function extractPageData(page: puppeteer.Page) {
  const data = await page.evaluate(() => {
    // Check for "Data not available" message
    const noDataElement = document.querySelector('[data-testid="dataDotViz-epiRollingFactoid-nodata"]')
    if (noDataElement) {
      return {
        confirmed: -1, // Use -1 to indicate "Unknown"
        weeklyIncrease: -1
      }
    }

    const currentCases = document.querySelector('[data-testid="dataDotViz-epiRollingFactoid-value"]')?.textContent
    const changeValue = document.querySelector('[data-testid="dataDotViz-epiRollingFactoid-change-value"]')?.textContent
    
    return {
      confirmed: parseInt(currentCases?.replace(/,/g, '') || '0'),
      weeklyIncrease: parseInt(
        changeValue?.trim()
          .replace(/[\u200E\u2212,]/g, '-')
          .replace(/[^-0-9]/g, '') || '0'
      )
    }
  })

  return {
    confirmed: data.confirmed === -1 ? 0 : (data.confirmed || 0),
    weeklyIncrease: data.weeklyIncrease === -1 ? 0 : (data.weeklyIncrease || 0)
  }
} 