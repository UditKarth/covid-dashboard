export interface CovidStats {
  id: string
  name: string
  code: string // Country/state code for jsvectormap
  confirmed: number
  deaths: number
  weeklyIncrease: number
}

export interface RegionData {
  name: string
  stats: CovidStats[]
}

