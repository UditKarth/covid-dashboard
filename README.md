# COVID-19 Dashboard

A real-time COVID-19 statistics dashboard that visualizes global case and death data from the World Health Organization (WHO).

## Features

- 🌍 Interactive world map visualization
- 📊 Real-time data scraping from WHO's official dashboard
- 📈 Country-specific statistics including:
  - Confirmed cases
  - Deaths
  - Weekly increases
- 🔍 Searchable country list
- 🔄 Auto-updating data (6-hour cache)
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: jsVectorMap
- **Data Source**: WHO COVID-19 Dashboard
- **Web Scraping**: Puppeteer
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/UditKarth/covid-dashboard.git
cd covid-19-dashboard
```

2. Install dependencies:

```bash
npm install
```
or 
```bash
yarn install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000` to view the dashboard.


## Data Updates

The dashboard fetches data from WHO's COVID-19 dashboard using a concurrent scraping system. Data is cached for 6 hours to minimize load on WHO's servers and ensure responsive performance.

### Data Structure

Each country's data includes:
- Confirmed cases
- Death count
- Weekly increase in cases
- Country code (for map visualization)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License

## Acknowledgments

- Data provided by the World Health Organization
- Map visualization powered by jsVectorMap
- UI components from shadcn/ui

## Notes

- The WHO dashboard's structure may change over time, which could affect the scraping functionality
- Some countries might show as "Data not available" if WHO doesn't have current statistics
- The concurrent scraping system is designed to be respectful of WHO's servers while maintaining performance

## Support

For support, please open an issue in the GitHub repository.