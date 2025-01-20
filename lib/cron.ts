import cron from 'node-cron'
import { scrapeWHOData } from './scraper'
import { writeFile } from 'fs/promises'

// Run every 6 hours
cron.schedule('0 */6 * * *', async () => {
  try {
    const data = await scrapeWHOData()
    await writeFile(
      './data/covid-data.json', 
      JSON.stringify(data, null, 2)
    )
    console.log('COVID data updated successfully')
  } catch (error) {
    console.error('Error updating COVID data:', error)
  }
}) 