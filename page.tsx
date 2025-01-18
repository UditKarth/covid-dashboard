'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsView } from './components/stats-view'
import { MapView } from './components/map-view'
import { getCovidData } from './actions/covid-data'
import { RegionData, CovidStats } from './types/covid'

export default function Page() {
  const [data, setData] = useState<{ global: RegionData[], totals: CovidStats } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCovidData()
      setData(result)
    }
    fetchData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (!data) return null

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

