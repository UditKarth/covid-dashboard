'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CovidStats } from '../types/covid'

interface RegionStatsProps {
  title: string
  stats: CovidStats[]
}

export function RegionStats({ title, stats }: RegionStatsProps) {
  const [search, setSearch] = useState('')
  
  const filteredStats = stats.filter(stat => 
    stat.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="h-[45vh]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Input 
            placeholder="Search..." 
            className="max-w-[200px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(45vh-100px)]">
          <div className="space-y-4">
            {filteredStats.map((stat) => (
              <div key={stat.name} className="flex justify-between items-center">
                <span className="font-medium">{stat.name}</span>
                <div className="space-x-4 text-sm">
                  <span>Confirmed: {stat.confirmed.toLocaleString()}</span>
                  <span>Deaths: {stat.deaths.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

