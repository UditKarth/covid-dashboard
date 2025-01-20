'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsView } from './components/stats-view'
import { MapView } from './components/map-view'
import { RegionData, CovidStats } from './types/covid'

export default function Page() {
  const [data, setData] = useState<{ global: RegionData[], totals: CovidStats } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/covid')
        if (!response.ok) throw new Error('Failed to fetch data')
        
        const result = await response.json()
        if (result.error) throw new Error(result.error)

        setData({
          global: result,
          totals: calculateTotals(result)
        })
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 6 * 60 * 60 * 1000) // 6 hours
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
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

