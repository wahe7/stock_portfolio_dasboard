# Stock Portfolio Dashboard

![Stock Portfolio Dashboard](https://img.shields.io/badge/status-active-brightgreen) 
![Next.js](https://img.shields.io/badge/Next.js-13.4.19-black) 
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue) 
![Prisma](https://img.shields.io/badge/Prisma-5.0.0-2D3748) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-06B6D4)

A modern, responsive stock portfolio management dashboard built with Next.js, TypeScript, and Tailwind CSS. Track your investments, analyze performance, and get insights into your stock portfolio with an intuitive user interface.

![Dashboard Preview](/public/dashboard-preview.png)

## ✨ Features

- **Portfolio Overview**: Get a quick summary of your investments
- **Interactive Data Tables**: Sort, filter, and manage your stock portfolio
- **Sector Analysis**: Visual breakdown of your investments by sector
- **Real-time Performance**: Track gains/losses and portfolio value
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: Protected routes with JWT
- **Loading States**: Smooth loading indicators for better UX

## 🚀 Tech Stack

- **Frontend**: 
  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - TanStack Table
  - Chart.js (for data visualization)

- **Backend**:
  - Node.js
  - Express
  - Prisma (ORM)
  - PostgreSQL
  - JWT (Authentication)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wahe7/stock_portfolio_dasboard.git
   cd stock_portfolio_dasboard
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:3001
   
   # Backend (in /backend/.env)
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the application**
   ```bash
   # Start the frontend (from root directory)
   npm run dev
   
   # In a new terminal, start the backend
   cd backend
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📈 Stock Data Integration

The application uses `yfinance` to fetch real-time stock market data. Here's how it works:

### Data Fetched for Each Stock:
- **Current Market Price (CMP)**: Real-time stock price
- **Sector**: Industry sector of the company
- **PE Ratio**: Price-to-Earnings ratio for valuation
- **Recommendation**: Analyst consensus (buy/hold/sell)
- **Company Name**: Official company name

### Implementation Details:
- Python script (`fetchCMP.py`) handles the data fetching
- Uses Yahoo Finance API through the `yfinance` library
- Returns data in JSON format for easy consumption
- Handles errors gracefully for unavailable symbols

### Example Response:
```json
{
  "RELIANCE.NS": {
    "sector": "Energy",
    "cmp": 2456.75,
    "recommendation": "buy",
    "name": "Reliance Industries",
    "pe": 24.56
  }
}
```

## 📊 Features in Detail

### Portfolio Management
- Add, edit, and delete stock holdings
- Track purchase price, quantity, and current market value
- View detailed performance metrics

### Data Visualization
- Interactive pie charts for sector allocation
- Performance tracking over time
- Responsive tables with sorting and filtering

### User Experience
- Loading indicators and smooth transitions
- Form validation and error handling
- Responsive design for all screen sizes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Table](https://tanstack.com/table/v8)
- [Chart.js](https://www.chartjs.org/)

---

Made with ❤️ by [Your Name] | [GitHub](https://github.com/wahe7)
