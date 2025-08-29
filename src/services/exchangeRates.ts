// Use ExchangeRate-API for real-time currency conversion
const API_KEY = 'd26b09d0610b48465cde0935';  // Replace with your API key
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export interface ExchangeRateResponse {
  conversion_rates: {
    [key: string]: number;
  };
}

/**
 * Get the latest exchange rates for a base currency
 * @param baseCurrency The currency to get rates for
 * @returns The exchange rates data
 */
export const getExchangeRates = async (baseCurrency: string): Promise<ExchangeRateResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (response.status === 404) {
        throw new Error('Invalid currency selected.');
      } else if (response.status >= 500) {
        throw new Error('Exchange rate service is temporarily unavailable.');
      }
      throw new Error(`Failed to fetch exchange rates (${response.status})`);
    }
    
    const data = await response.json();
    if (!data.conversion_rates) {
      throw new Error('Invalid response from exchange rate service');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};
