import puppeteer from 'puppeteer'
import { CovidStats, RegionData } from '../types/covid'
import { worldCountries } from '../data/regions'

// Add a type for the progress callback
type ProgressCallback = (data: RegionData[], progress: { 
  total: number, 
  current: number, 
  country?: string 
}) => void

export async function scrapeWHOData(
  onProgress?: ProgressCallback
): Promise<RegionData[]> {
  try {
    console.log('Launching browser...')
    const browser = await puppeteer.launch({
      headless: 'new',
    })

    const page = await browser.newPage()
    
    // First get global data
    console.log('Fetching global data...')
    await page.goto('https://data.who.int/dashboards/covid19/cases?n=c', {
      waitUntil: 'networkidle0',
    })

    const globalData = await extractPageData(page)
    const stats: CovidStats[] = [{
      id: 'world-global',
      name: 'Global',
      code: 'GLOBAL',
      confirmed: globalData.confirmed,
      deaths: 0,
      weeklyIncrease: globalData.weeklyIncrease
    }]

    // Notify of initial global data
    onProgress?.([{
      name: 'world',
      stats: stats
    }], { total: 180, current: 1 })

    // Generate country IDs (004 to 716, step by 4)
    const countryIds = Array.from({ length: 179 }, (_, i) => String(4 + i * 4).padStart(3, '0'))

    // Fetch data for each country
    for (let i = 0; i < countryIds.length; i++) {
      const id = countryIds[i]
      const url = `https://data.who.int/dashboards/covid19/cases?m49=${id}&n=c`
      console.log(`Fetching data for country ID: ${id} (${i + 1}/${countryIds.length})`)
      
      try {
        await page.goto(url, { waitUntil: 'networkidle0' })
        await page.waitForSelector('[data-testid="dataDotViz-epiRollingFactoid-value"]', { timeout: 5000 })
        
        const countryData = await extractPageData(page)
        
        // Find matching country
        const country = worldCountries.find(c => 
          page.url().includes(c.name.toLowerCase()) || 
          page.url().includes(c.code.toLowerCase())
        )

        if (country && countryData.confirmed > 0) {
          stats.push({
            id: `world-${country.code.toLowerCase()}`,
            name: country.name,
            code: country.code,
            confirmed: countryData.confirmed,
            deaths: 0,
            weeklyIncrease: countryData.weeklyIncrease
          })

          // Notify of progress with updated data
          onProgress?.([{
            name: 'world',
            stats: stats
          }], {
            total: countryIds.length + 1,
            current: i + 2,
            country: country.name
          })
        }
      } catch (error) {
        console.error(`Error fetching data for country ID ${id}:`, error)
        continue
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    }

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

async function extractPageData(page: puppeteer.Page) {
  const data = await page.evaluate(() => {
    const currentCases = document.querySelector('[data-testid="dataDotViz-epiRollingFactoid-value"]')?.textContent
    const changeValue = document.querySelector('[data-testid="dataDotViz-epiRollingFactoid-change-value"]')?.textContent
    const cleanedChange = changeValue?.trim()
      .replace(/[\u200E\u2212,]/g, '-')
      .replace(/[^-0-9]/g, '') || '0'
    
    return {
      confirmed: parseInt(currentCases?.replace(/,/g, '') || '0'),
      weeklyIncrease: parseInt(cleanedChange || '0')
    }
  })

  return data
} 