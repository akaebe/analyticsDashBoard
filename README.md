# BLA Analytics Dashboard

A comprehensive political analytics dashboard built with React for monitoring and analyzing BLA (Political Organization) activities, performance metrics, and family engagement patterns.

## 🚀 Features

### 📊 Interactive Visualizations
- **Dynamic Charts**: Line charts, bar charts, and scatter plots for trend analysis
- **Heat Maps**: Visual representation of activity patterns and engagement levels
- **Real-time Data**: Live updates of political activities and metrics
- **Responsive Design**: Optimized for desktop and mobile viewing

### 📈 Analytics Modules
- **Overview Dashboard**: High-level metrics and key performance indicators
- **BLA Activity Tracking**: Monitor daily activities and engagement rates
- **Performance Analysis**: Detailed performance metrics and trend analysis
- **Family Size Analysis**: Demographic insights and family engagement patterns
- **Timeline Analysis**: Historical data visualization and trend tracking

### 🔧 Technical Features
- **Modern React Architecture**: Built with React 18+ and modern hooks
- **State Management**: Redux Toolkit for efficient state management
- **Data Processing**: Advanced CSV processing and data transformation
- **Chart Responsiveness**: Auto-resizing charts with custom hooks
- **Modular Design**: Clean, maintainable component architecture

## 🛠️ Tech Stack

- **Frontend**: React 18, JSX
- **State Management**: Redux Toolkit
- **Charts**: Custom chart components with interactive features
- **Styling**: Modern CSS with responsive design
- **Build Tool**: Vite for fast development and building
- **Data Processing**: CSV parsing and data transformation utilities

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup
```bash
# Clone the repository
git clone https://github.com/akaebe/analyticsDashBoard.git
cd analyticsDashBoard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
analyticsDashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── charts/         # Chart components (Bar, Line, Scatter, Heatmap)
│   │   └── layout/         # Layout components (Header, Navigation)
│   ├── features/           # Feature-specific modules
│   │   ├── overview/       # Dashboard overview
│   │   ├── blaactivity/    # BLA activity tracking
│   │   ├── blaperformance/ # Performance analytics
│   │   ├── familySize/     # Family size analysis
│   │   └── timeline/       # Timeline analysis
│   ├── store/              # Redux store and slices
│   ├── services/           # Data loading and API services
│   ├── utils/              # Utility functions and helpers
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── dist/                   # Data files (CSV) - not tracked in Git
```

## 📊 Data Sources

The dashboard processes various CSV data sources:

### BLA Timeline Analysis
- `00_timeline_summary.csv` - Overall timeline metrics
- `01_family_creation_timeline.csv` - Family formation patterns
- `02_bla_performance_summary.csv` - Performance indicators
- `03_inter_family_gaps.csv` - Gap analysis between families

### Family Phone Analysis
- `00_summary.csv` - Summary statistics
- `01_duplicate_numbers.csv` - Duplicate contact analysis
- `02_family_size_analysis.csv` - Family size distribution
- `03_single_family_phone_check.csv` - Single family verification
- `04_bla_daily_activity.csv` - Daily activity patterns
- `05_ac_coverage.csv` - Coverage analysis

## 🎯 Key Features by Module

### 1. Overview Dashboard
- Executive summary with key metrics
- Interactive charts showing trends
- Summary tables with actionable insights
- Real-time performance indicators

### 2. BLA Activity Tracking
- Daily activity monitoring
- Engagement rate analysis
- Activity pattern visualization
- Performance trend tracking

### 3. Performance Analytics
- Detailed performance metrics
- Comparative analysis tools
- Historical performance tracking
- Goal vs actual performance visualization

### 4. Family Size Analysis
- Demographic breakdowns
- Family size distribution analysis
- Engagement correlation with family size
- Geographic distribution insights

### 5. Timeline Analysis
- Historical trend visualization
- Event timeline tracking
- Performance evolution over time
- Milestone and achievement tracking

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Custom Hooks
- `useChartResize.js` - Automatic chart resizing based on container dimensions

### State Management
The application uses Redux Toolkit with feature-specific slices:
- `dashboardSlice.js` - Main dashboard state
- `blaActivitySlice.js` - BLA activity data
- `blaPerformanceSlice.js` - Performance metrics
- `familySizeSlice.js` - Family analysis data
- `timelineSlice.js` - Timeline data

## 📈 Chart Types

- **Line Charts**: Trend analysis over time
- **Bar Charts**: Comparative analysis and distributions
- **Scatter Charts**: Correlation analysis
- **Heat Maps**: Pattern visualization and intensity mapping

## 🔒 Data Security

- CSV files are stored locally and not committed to version control
- Sensitive data is processed client-side only
- No external data transmission for sensitive information

## 🚀 Deployment

The application can be deployed to any static hosting service:

```bash
# Build the application
npm run build

# Deploy the dist/ folder to your hosting service
```

Recommended hosting platforms:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## 🔮 Future Enhancements

- [ ] Real-time data synchronization
- [ ] Advanced filtering and search capabilities
- [ ] Export functionality for reports
- [ ] Mobile app version
- [ ] Integration with external APIs
- [ ] Advanced predictive analytics
- [ ] User authentication and role-based access

---

Built with ❤️ for political analytics and community engagement tracking.
