'use client'

import { RegionData } from '../types/covid'
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./dynamic-map').then(mod => mod.DynamicMap), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-4">
      <div className="h-[calc(100vh-200px)] bg-muted/10 animate-pulse rounded-lg" />
    </div>
  )
})

interface MapViewProps {
  data: RegionData[]
}

export function MapView({ data }: MapViewProps) {
  return <DynamicMap data={data} />
}

