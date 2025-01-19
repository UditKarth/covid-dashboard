'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { RegionData, CovidStats } from '../types/covid'
// Import these separately to ensure proper loading
import jsVectorMap from 'jsvectormap'
import 'jsvectormap/dist/maps/world.js'
import 'jsvectormap/dist/maps/world-merc.js'

interface MapViewProps {
  data: RegionData[]
}

export function DynamicMap({ data }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [mapInstance, setMapInstance] = useState<any>(null)
    const [selectedRegion, setSelectedRegion] = useState<string>('world')
    const [hoveredRegion, setHoveredRegion] = useState<CovidStats | null>(null)
  
    useEffect(() => {
      const timer = setTimeout(() => {
        // Ensure we're in the browser environment
        if (typeof window === 'undefined' || !mapRef.current) return
  
        // Clean up previous instance
        if (mapInstance) {
          mapInstance.destroy()
        }
  
        // Get the correct data for the selected region
        const regionData = data.find(r => r.name === selectedRegion)
        if (!regionData) return
  
        // Prepare data for the map
        const values: Record<string, number> = {}
        regionData.stats.forEach(stat => {
          values[stat.code] = stat.confirmed
        })
  
        // Create new map instance
        const map = new jsVectorMap({
          selector: mapRef.current,
          map: selectedRegion === 'us' ? 'us_merc' : 'world_merc',
          zoomButtons: true,
          zoomOnScroll: true,
          panOnDrag: true,
          backgroundColor: 'transparent',
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
            console.log('Hover detected:', code); // Debug log
            const stat = regionData.stats.find(s => s.code === code)
            if (stat) {
              element.html('') // Prevent default tooltip
              setHoveredRegion(stat)
            }
          },
          onRegionOut: function() {
            console.log('Hover ended'); // Debug log
            setHoveredRegion(null)
          }
        })
  
        setMapInstance(map)
      }, 100)
  
      return () => {
        clearTimeout(timer)
        if (mapInstance) {
          mapInstance.destroy()
        }
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