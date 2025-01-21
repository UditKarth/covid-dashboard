import { scrapeWHOData } from '@/lib/scraper'
import { NextResponse } from 'next/server'

// Cache the data for 6 hours
export const revalidate = 21600

export async function GET() {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // Keep track of connection status
  let isConnected = true

  try {
    const response = new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

    // Handle client disconnection
    response.socket?.on('close', () => {
      console.log('Client disconnected')
      isConnected = false
    })

    // Start scraping with progress updates
    scrapeWHOData(async (data, progress) => {
      if (!isConnected) {
        console.log('Stopping scrape due to client disconnection')
        return
      }

      try {
        const message = JSON.stringify({
          data,
          progress,
        })
        await writer.write(encoder.encode(`data: ${message}\n\n`))
      } catch (error) {
        console.error('Error writing to stream:', error)
      }
    }).finally(() => {
      if (isConnected) {
        writer.close()
      }
    })

    return response
  } catch (error) {
    console.error('Error in COVID data route:', error)
    writer.close()
    return new NextResponse('Error fetching COVID data', { status: 500 })
  }
} 