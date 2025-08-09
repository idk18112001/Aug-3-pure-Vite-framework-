// API configuration and data fetching utilities
export const API_CONFIG = {
  ALPHA_VANTAGE: {
    BASE_URL: 'https://www.alphavantage.co/query',
    API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo', // You'll need to get a free API key
  },
  IEX_CLOUD: {
    BASE_URL: 'https://cloud.iexapis.com/stable',
    API_KEY: import.meta.env.VITE_IEX_CLOUD_API_KEY || '',
  },
  COINGECKO: {
    BASE_URL: 'https://api.coingecko.com/api/v3',
    // No API key needed for basic usage
  }
};

// Stock data interface
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  timestamp: string;
}

// Economic indicator interface
export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  date: string;
  change?: number;
}

// Alpha Vantage API functions
export const alphaVantageAPI = {
  async getQuote(symbol: string): Promise<StockData | null> {
    try {
      const response = await fetch(
        `${API_CONFIG.ALPHA_VANTAGE.BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE.API_KEY}`
      );
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      const quote = data['Global Quote'];
      if (!quote) return null;

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        timestamp: quote['07. latest trading day']
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      return null;
    }
  },

  async getTimeSeriesDaily(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${API_CONFIG.ALPHA_VANTAGE.BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE.API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching time series:', error);
      return null;
    }
  },

  async getEconomicIndicator(indicator: string): Promise<EconomicIndicator | null> {
    try {
      // Examples: GDP, INFLATION, UNEMPLOYMENT, FEDERAL_FUNDS_RATE
      const response = await fetch(
        `${API_CONFIG.ALPHA_VANTAGE.BASE_URL}?function=${indicator}&interval=annual&apikey=${API_CONFIG.ALPHA_VANTAGE.API_KEY}`
      );
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      // Parse the economic data (structure varies by indicator)
      const dataPoints = data.data;
      if (!dataPoints || dataPoints.length === 0) return null;

      const latest = dataPoints[0];
      return {
        name: data.name || indicator,
        value: parseFloat(latest.value),
        unit: data.unit || '',
        date: latest.date,
      };
    } catch (error) {
      console.error('Error fetching economic indicator:', error);
      return null;
    }
  }
};

// CoinGecko API for crypto data
export const coinGeckoAPI = {
  async getTopCryptos(limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.COINGECKO.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  },

  async getCryptoPrice(coinId: string): Promise<any> {
    try {
      const response = await fetch(
        `${API_CONFIG.COINGECKO.BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      return null;
    }
  }
};

// Generic API wrapper with caching
export class DataCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async get<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttlMinutes: number = 5
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: ttlMinutes * 60 * 1000
    });

    return data;
  }

  clear() {
    this.cache.clear();
  }
}

export const dataCache = new DataCache();
