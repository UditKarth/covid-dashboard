'use server'

import { CovidStats, RegionData } from '../types/covid'
import { worldCountries, usStates, europeanCountries } from '../data/regions'
import { readFile } from 'fs/promises'

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


export async function getCovidData() {
  try {
    const data = await readFile('./data/covid-data.json', 'utf-8')
    const parsedData = JSON.parse(data)
    return {
      global: parsedData,
      totals: calculateTotals(parsedData)
    }
  } catch (error) {
    console.error('Error reading COVID data:', error)
    return { global: [], totals: {} }
  }
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

