'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
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
            placeholder="Search countries..." 
            className="max-w-[200px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(45vh-100px)]">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Confirmed</TableHead>
                <TableHead className="text-right">Deaths</TableHead>
                <TableHead className="text-right">Weekly Inc.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStats.map((stat) => (
                <TableRow key={stat.code}>
                  <TableCell className="font-medium">{stat.name}</TableCell>
                  <TableCell className="text-right">{stat.confirmed.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stat.deaths.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{stat.weeklyIncrease.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

