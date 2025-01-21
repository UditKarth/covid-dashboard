'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsView } from './components/stats-view'
import { MapView } from './components/map-view'
import { RegionData, CovidStats } from './types/covid'

export default function Page() {
  const [data, setData] = useState<{ global: RegionData[], totals: CovidStats } | null>(null)
  const [progress, setProgress] = useState<{ current: number; total: number; country?: string } | null>(null)

  useEffect(() => {
    const eventSource = new EventSource('/api/covid')

    eventSource.onmessage = (event) => {
      const { data: newData, progress: newProgress } = JSON.parse(event.data)
      setData({
        global: newData,
        totals: calculateTotals(newData)
      })
      setProgress(newProgress)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <div className="animate-pulse">Loading...</div>
        {progress && (
          <div className="text-sm text-muted-foreground">
            Scraping data: {progress.current}/{progress.total}
            {progress.country && ` - ${progress.country}`}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="stats" className="p-4">
        <TabsList>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <StatsView data={data.global} totals={data.totals} />
        </TabsContent>
        <TabsContent value="map">
          <MapView data={data.global} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function calculateTotals(data: RegionData[]): CovidStats {
  const worldStats = data.find(r => r.name === 'world')?.stats || []
  return {
    id: 'global-total',
    name: 'Global',
    code: 'GLOBAL',
    confirmed: worldStats.reduce((sum, stat) => sum + stat.confirmed, 0),
    deaths: worldStats.reduce((sum, stat) => sum + stat.deaths, 0),
    weeklyIncrease: worldStats.reduce((sum, stat) => sum + stat.weeklyIncrease, 0)
  }
}

