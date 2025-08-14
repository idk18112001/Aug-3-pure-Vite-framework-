// Market Data API Integration Layer
// Combines multiple data sources for comprehensive analysis

const ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const POLYGON_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const FRED_KEY = import.meta.env.VITE_FRED_API_KEY;
const GOOGLE_TRENDS_KEY = import.meta.env.VITE_GOOGLE_TRENDS_API_KEY;

// Base URLs
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
const POLYGON_BASE = 'https://api.polygon.io';
const FRED_BASE = 'https://api.stlouisfed.org/fred';

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface MarketAnalysis {
  symbol: string;
  bullishProbability: number;
  bearishProbability: number;
  rangeBoundProbability: number;
  confidence: number;
  reasoning: string[];
  indicatorSignals: {
    [key: string]: 'bullish' | 'bearish' | 'neutral';
  };
}

export interface IndicatorData {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

// Stock Price Data (Polygon.io)
export const getStockPrice = async (symbol: string): Promise<StockPrice> => {
  try {
    const response = await fetch(
      `${POLYGON_BASE}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${POLYGON_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const change = result.c - result.o;
      const changePercent = (change / result.o) * 100;
      
      return {
        symbol: symbol.toUpperCase(),
        price: result.c,
        change: change,
        changePercent: changePercent,
        volume: result.v,
        timestamp: new Date(result.t).toISOString()
      };
    }
    
    throw new Error('No price data available');
  } catch (error) {
    console.error('Error fetching stock price:', error);
    throw new Error(`Failed to fetch price for ${symbol}`);
  }
};

// Consumer Price Index (Alpha Vantage)
export const getCPIData = async (): Promise<IndicatorData> => {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=CPI&interval=monthly&apikey=${ALPHA_VANTAGE_KEY}`
    );
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    const cpiData = data.data;
    const latest = cpiData[0];
    const previous = cpiData[1];
    
    const trend = latest.value > previous.value ? 'up' : 
                  latest.value < previous.value ? 'down' : 'stable';
    
    return {
      id: 'cpi',
      name: 'Consumer Price Index',
      value: parseFloat(latest.value),
      trend,
      impact: 'high',
      lastUpdated: latest.date
    };
  } catch (error) {
    console.error('Error fetching CPI data:', error);
    throw error;
  }
};

// Crude Oil Prices (Alpha Vantage)
export const getCrudeOilPrices = async (): Promise<{wti: IndicatorData, brent: IndicatorData}> => {
  try {
    const [wtiResponse, brentResponse] = await Promise.all([
      fetch(`${ALPHA_VANTAGE_BASE}?function=WTI&interval=monthly&apikey=${ALPHA_VANTAGE_KEY}`),
      fetch(`${ALPHA_VANTAGE_BASE}?function=BRENT&interval=monthly&apikey=${ALPHA_VANTAGE_KEY}`)
    ]);
    
    const wtiData = await wtiResponse.json();
    const brentData = await brentResponse.json();
    
    const processOilData = (data: any, name: string, id: string): IndicatorData => {
      const oilData = data.data;
      const latest = oilData[0];
      const previous = oilData[1];
      
      const trend = latest.value > previous.value ? 'up' : 
                    latest.value < previous.value ? 'down' : 'stable';
      
      return {
        id,
        name,
        value: parseFloat(latest.value),
        trend,
        impact: 'medium',
        lastUpdated: latest.date
      };
    };
    
    return {
      wti: processOilData(wtiData, 'WTI Crude Oil', 'wti'),
      brent: processOilData(brentData, 'Brent Crude Oil', 'brent')
    };
  } catch (error) {
    console.error('Error fetching crude oil prices:', error);
    throw error;
  }
};

// Insider Transactions (Alpha Vantage)
export const getInsiderTransactions = async (symbol: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE}?function=INSIDER_TRANSACTIONS&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching insider transactions:', error);
    throw error;
  }
};

// Market Analysis Engine
export const analyzeStock = async (symbol: string, selectedIndicators: string[]): Promise<MarketAnalysis> => {
  try {
    // Get current stock price
    const stockPrice = await getStockPrice(symbol);
    
    // Get relevant indicator data
    const indicators: { [key: string]: any } = {};
    
    // Fetch indicator data based on selection
    if (selectedIndicators.includes('cpi')) {
      indicators.cpi = await getCPIData();
    }
    
    if (selectedIndicators.includes('crude-oil')) {
      indicators.crudeOil = await getCrudeOilPrices();
    }
    
    if (selectedIndicators.includes('insider-activity')) {
      indicators.insiderActivity = await getInsiderTransactions(symbol);
    }
    
    // Analysis algorithm
    const signals: { [key: string]: 'bullish' | 'bearish' | 'neutral' } = {};
    const reasoning: string[] = [];
    let bullishScore = 0;
    let bearishScore = 0;
    let neutralScore = 0;
    
    // CPI Analysis
    if (indicators.cpi) {
      const cpi = indicators.cpi;
      if (cpi.value > 3.0) { // High inflation
        signals.cpi = 'bearish';
        bearishScore += 2;
        reasoning.push(`High inflation (${cpi.value}%) typically pressures stock valuations`);
      } else if (cpi.value < 2.0) { // Low inflation
        signals.cpi = 'bullish';
        bullishScore += 1;
        reasoning.push(`Moderate inflation (${cpi.value}%) supports economic growth`);
      } else {
        signals.cpi = 'neutral';
        neutralScore += 1;
        reasoning.push(`Inflation (${cpi.value}%) within normal range`);
      }
    }
    
    // Insider Activity Analysis
    if (indicators.insiderActivity && indicators.insiderActivity.length > 0) {
      const recentTransactions = indicators.insiderActivity.slice(0, 10);
      const buyTransactions = recentTransactions.filter((t: any) => 
        t.transaction_type.toLowerCase().includes('buy') || 
        t.transaction_type.toLowerCase().includes('purchase')
      );
      
      if (buyTransactions.length > recentTransactions.length * 0.6) {
        signals.insiderActivity = 'bullish';
        bullishScore += 3;
        reasoning.push(`Strong insider buying activity (${buyTransactions.length}/${recentTransactions.length} recent transactions)`);
      } else if (buyTransactions.length < recentTransactions.length * 0.3) {
        signals.insiderActivity = 'bearish';
        bearishScore += 2;
        reasoning.push(`Limited insider buying activity suggests caution`);
      } else {
        signals.insiderActivity = 'neutral';
        neutralScore += 1;
        reasoning.push(`Mixed insider trading activity`);
      }
    }
    
    // Technical momentum analysis
    if (stockPrice.changePercent > 2) {
      bullishScore += 1;
      reasoning.push(`Strong positive momentum (+${stockPrice.changePercent.toFixed(2)}%)`);
    } else if (stockPrice.changePercent < -2) {
      bearishScore += 1;
      reasoning.push(`Negative momentum (${stockPrice.changePercent.toFixed(2)}%)`);
    }
    
    // Calculate probabilities
    const totalScore = bullishScore + bearishScore + neutralScore;
    const bullishProbability = totalScore > 0 ? (bullishScore / totalScore) * 100 : 33.33;
    const bearishProbability = totalScore > 0 ? (bearishScore / totalScore) * 100 : 33.33;
    const rangeBoundProbability = 100 - bullishProbability - bearishProbability;
    
    // Confidence based on data availability
    const dataPoints = Object.keys(indicators).length + 1; // +1 for price data
    const confidence = Math.min(90, 40 + (dataPoints * 15));
    
    return {
      symbol: symbol.toUpperCase(),
      bullishProbability: Math.round(bullishProbability),
      bearishProbability: Math.round(bearishProbability),
      rangeBoundProbability: Math.round(rangeBoundProbability),
      confidence,
      reasoning,
      indicatorSignals: signals
    };
    
  } catch (error) {
    console.error('Error analyzing stock:', error);
    throw new Error(`Failed to analyze ${symbol}`);
  }
};

// NSE Data (will be implemented via backend API routes due to CORS)
export const getNSEBulkDeals = async (date?: string) => {
  // This will be implemented as a backend API route
  // due to CORS restrictions with NSE APIs
  return fetch('/api/nse/bulk-deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date })
  }).then(res => res.json());
};

export const getNSEBlockDeals = async (date?: string) => {
  return fetch('/api/nse/block-deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date })
  }).then(res => res.json());
};

export const getNSEFOData = async (symbol: string) => {
  return fetch('/api/nse/fo-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol })
  }).then(res => res.json());
};
