# LucidQuant API Integration - Deployment Guide

## ✅ What's Already Implemented

### API Services Integrated:
1. **Alpha Vantage** - Stock prices, company fundamentals
2. **Polygon.io** - Advanced market data, crude oil prices  
3. **FRED (Federal Reserve)** - Economic indicators (CPI, etc.)
4. **Google Trends** - Search sentiment analysis

### Features Live:
- ✅ Real-time stock analysis with bullish/bearish/range-bound probabilities
- ✅ Multi-factor analysis combining economic indicators
- ✅ Interactive StockSearch component with probability visualization
- ✅ Confidence scoring and detailed reasoning for each analysis

## 🔧 Vercel Environment Variables Setup

To activate the APIs in production, add these environment variables in your Vercel dashboard:

**Vercel Dashboard → Project → Settings → Environment Variables**

```env
VITE_ALPHA_VANTAGE_API_KEY=MU4QX03PJ95E2F8U
VITE_POLYGON_API_KEY=fELrw4NbyBqopZ90lQv2ZA1ICj41Ip8F
VITE_FRED_API_KEY=371e3a2dcd6fcbb871bb93d4bdb6ee9c
VITE_GOOGLE_TRENDS_API_KEY=69bf0c1258dc3608c514b8946ce5a895b61733ae19cced2304e770037b9ae78e
```

## 📊 API Usage & Limits

### Alpha Vantage (Stock Data)
- **Key**: MU4QX03PJ95E2F8U
- **Limit**: 25 requests/day, 5 requests/minute
- **Used for**: Stock prices, company data

### Polygon.io (Market Data)  
- **Key**: fELrw4NbyBqopZ90lQv2ZA1ICj41Ip8F
- **Limit**: 5 requests/minute (free tier)
- **Used for**: Crude oil prices, advanced market data

### FRED (Economic Data)
- **Key**: 371e3a2dcd6fcbb871bb93d4bdb6ee9c
- **Limit**: No official limit (reasonable usage)
- **Used for**: CPI, inflation data, economic indicators

### Google Trends
- **Key**: 69bf0c1258dc3608c514b8946ce5a895b61733ae19cced2304e770037b9ae78e
- **Note**: Custom implementation for search sentiment

## 🚀 How to Test the APIs

1. **Visit**: https://lucidquant.in/indicator/1
2. **Scroll to**: "Real-Time Stock Analysis" section
3. **Enter stock symbol**: AAPL, TSLA, NVDA, etc.
4. **Click Analyze**: See real-time probability calculations

### Expected Results:
- **Bullish/Bearish/Range-bound probabilities** (0-100%)
- **Confidence score** based on data quality
- **Detailed reasoning** explaining the analysis
- **Key indicators** showing CPI, crude oil, insider activity, sentiment

## 🔍 API Functions Available

### Core Analysis:
- `analyzeStock(symbol)` - Complete multi-factor analysis
- `getStockPrice(symbol)` - Real-time stock prices
- `getCPIData()` - Latest inflation data
- `getCrudeOilPrice()` - Current oil prices

### Supporting Data:
- `getInsiderActivity(symbol)` - Insider transaction patterns
- `getSearchTrends(symbol)` - Google search sentiment
- `getBalticDryIndex()` - Global trade indicator

## 📈 Analysis Algorithm

The system combines multiple factors:

1. **Stock Price Momentum** (25% weight)
   - Recent price changes and volatility

2. **Economic Indicators** (25% weight)  
   - CPI data, inflation trends
   - Crude oil prices (sector-dependent)

3. **Insider Activity** (30% weight)
   - Buy vs sell transactions by company insiders
   - Transaction volumes and timing

4. **Market Sentiment** (20% weight)
   - Google search trends
   - Public interest patterns

## 🔧 Troubleshooting

### If APIs don't work:
1. **Check Vercel env vars** - Make sure all keys are set
2. **API limits** - Free tiers have usage restrictions  
3. **CORS issues** - Some APIs may need proxy setup
4. **Fallback data** - System shows simulated data if APIs fail

### Error Handling:
- All APIs have fallback mechanisms
- Graceful degradation if services are unavailable
- Toast notifications for user feedback

## 🎯 Next Steps

1. **Set environment variables** in Vercel dashboard
2. **Test the analysis tool** on live site
3. **Monitor API usage** to avoid hitting limits
4. **Consider upgrading** API plans for higher limits

Your API integration is now complete and ready for production use!
