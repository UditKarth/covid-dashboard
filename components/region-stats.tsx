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
  const [page, setPage] = useState(1)
  const itemsPerPage = 20
  
  const filteredStats = stats.filter(stat => 
    stat.name.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedStats = filteredStats.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const totalPages = Math.ceil(filteredStats.length / itemsPerPage)

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
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Confirmed</TableHead>
                <TableHead className="text-right">Deaths</TableHead>
                <TableHead className="text-right">Weekly Inc.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStats.map((stat) => (
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
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">
            Showing {paginatedStats.length} of {filteredStats.length} countries
          </span>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 text-sm rounded border disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="px-2 py-1 text-sm rounded border disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

