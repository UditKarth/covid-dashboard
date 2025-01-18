'use server'

import { CovidStats, RegionData } from '../types/covid'
import { worldCountries, usStates, europeanCountries } from '../data/regions'

function generateRandomStats(place: { name: string, code: string }, regionId: string): CovidStats {
  return {
    id: `${regionId}-${place.code.toLowerCase()}`,
    name: place.name,
    code: place.code,
    confirmed: Math.floor(Math.random() * 1000000),
    deaths: Math.floor(Math.random() * 50000),
    weeklyIncrease: Math.floor(Math.random() * 10000)
  }
}

export async function getCovidData(): Promise<{
  global: RegionData[]
  totals: CovidStats
}> {
  const regions = {
    world: worldCountries,
    us: usStates,
    europe: europeanCountries,
  }

  const data = Object.entries(regions).map(([region, places]) => ({
    name: region,
    stats: places.map(place => generateRandomStats(place, region))
  }))

  const totals = {
    id: 'global-total',
    name: 'Global',
    code: 'GLOBAL',
    confirmed: data.reduce((acc, region) => 
      acc + region.stats.reduce((sum, stat) => sum + stat.confirmed, 0), 0),
    deaths: data.reduce((acc, region) => 
      acc + region.stats.reduce((sum, stat) => sum + stat.deaths, 0), 0),
    weeklyIncrease: data.reduce((acc, region) => 
      acc + region.stats.reduce((sum, stat) => sum + stat.weeklyIncrease, 0), 0)
  }

  return { global: data, totals }
}

