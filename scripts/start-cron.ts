import { scrapeWHOData } from '../lib/scraper'
import { writeFile } from 'fs/promises'
import cron from 'node-cron'
import path from 'path'

console.log('Starting COVID data cron job...')

// Run immediately on startup
async function updateData() {
  try {
    console.log('Fetching COVID data...')
    const data = await scrapeWHOData()
    const filePath = path.join(process.cwd(), 'data', 'covid-data.json')
    
    await writeFile(filePath, JSON.stringify(data, null, 2))
    console.log('COVID data updated successfully')
  } catch (error) {
    console.error('Error updating COVID data:', error)
  }
}

// Run immediately
updateData()

// Then run every 6 hours
cron.schedule('0 */6 * * *', updateData) 