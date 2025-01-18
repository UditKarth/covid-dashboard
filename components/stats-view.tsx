'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RegionStats } from './region-stats'
import { RegionData, CovidStats } from '../types/covid'

interface StatsViewProps {
  data: RegionData[]
  totals: CovidStats
}

export function StatsView({ data, totals }: StatsViewProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Left sidebar */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Global Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Confirmed</p>
              <p className="text-2xl font-bold">{totals.confirmed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Deaths</p>
              <p className="text-2xl font-bold">{totals.deaths.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weekly Increase</p>
              <p className="text-2xl font-bold">{totals.weeklyIncrease.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side scrollable regions */}
      <div className="col-span-2 space-y-4">
        {data.map((region) => (
          <RegionStats 
            key={region.name} 
            title={region.name.charAt(0).toUpperCase() + region.name.slice(1)} 
            stats={region.stats} 
          />
        ))}
      </div>
    </div>
  )
}

