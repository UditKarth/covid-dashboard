import { scrapeWHOData } from '@/lib/scraper'
import { NextResponse } from 'next/server'

// Cache the data for 6 hours
export const revalidate = 21600

export async function GET() {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // Start scraping with progress updates
  scrapeWHOData((data, progress) => {
    const message = JSON.stringify({
      data,
      progress,
    })
    writer.write(encoder.encode(`data: ${message}\n\n`))
  }).finally(() => {
    writer.close()
  })

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 