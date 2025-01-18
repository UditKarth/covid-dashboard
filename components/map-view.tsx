'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { RegionData, CovidStats } from '../types/covid'
import jsVectorMap from 'jsvectormap'
import 'jsvectormap/dist/maps/world'


interface MapViewProps {
  data: RegionData[]
}

export function MapView({ data }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>('world')
  const [hoveredRegion, setHoveredRegion] = useState<CovidStats | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Clean up previous instance
    if (mapInstance) {
      mapInstance.destroy()
    }

    // Get the correct data for the selected region
    const regionData = data.find(r => r.name === selectedRegion)
    if (!regionData) return

    // Prepare data for the map
    const values: Record<string, number> = {}
    const markers: Array<{ name: string; coords: [number, number] }> = []
    
    regionData.stats.forEach(stat => {
      values[stat.code] = stat.confirmed
    })

    // Create new map instance
    const map = new jsVectorMap({
      selector: mapRef.current,
      map: selectedRegion === 'us' ? 'us' : 'world',
      zoomButtons: true,
      zoomOnScroll: true,
      panOnDrag: true,
      backgroundColor: 'transparent',
      markers,
      series: {
        regions: [{
          values,
          scale: ['#FFE5E5', '#FF0000'],
          normalizeFunction: 'polynomial',
          min: Math.min(...Object.values(values)),
          max: Math.max(...Object.values(values))
        }]
      },
      onRegionTipShow: function(event: any, element: any, code: string) {
        const stat = regionData.stats.find(s => s.code === code)
        if (stat) {
          element.html(`
            <div class="bg-white p-2 rounded shadow-lg border">
              <strong>${stat.name}</strong><br/>
              Confirmed: ${stat.confirmed.toLocaleString()}<br/>
              Deaths: ${stat.deaths.toLocaleString()}<br/>
              Weekly Increase: ${stat.weeklyIncrease.toLocaleString()}
            </div>
          `)
          setHoveredRegion(stat)
        }
      },
      onRegionOut: function() {
        setHoveredRegion(null)
      }
    })

    setMapInstance(map)

    return () => {
      map.destroy()
    }
  }, [data, selectedRegion])

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${selectedRegion === 'world' ? 'bg-primary text-white' : 'bg-secondary'}`}
          onClick={() => setSelectedRegion('world')}
        >
          World
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedRegion === 'us' ? 'bg-primary text-white' : 'bg-secondary'}`}
          onClick={() => setSelectedRegion('us')}
        >
          United States
        </button>
      </div>

      <Card className="relative">
        <div ref={mapRef} style={{ height: 'calc(100vh - 200px)' }} />
        
      </Card>
    </div>
  )
}

