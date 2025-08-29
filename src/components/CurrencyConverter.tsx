import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import { getExchangeRates } from '../services/exchangeRates';
import { country_list } from '../data/countryList';
import { addConversion } from '../features/history/historySlice';
import ConversionHistory from './ConversionHistory';
import './CurrencyConverter.css';





function CurrencyConverter() {
  const dispatch = useDispatch();
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get exchange rate
  const getExchangeRate = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      if (loading) { // Only set error if we were actually trying to convert
        setError('Please enter a valid amount');
      }
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching exchange rate for:', from, 'to', to);
      
      // Create a promise that resolves after minimum delay (800ms)
      const minDelay = new Promise(resolve => setTimeout(resolve, 800));
      
      // Fetch data and wait for minimum delay in parallel
      const [data] = await Promise.all([
        getExchangeRates(from),
        minDelay
      ]);
      
      // Check if we got conversion rates and if the target currency exists
      if (!data.conversion_rates) {
        console.error('No conversion rates in response:', data);
        throw new Error('Invalid response from exchange rate service');
      }
      
      if (!(to in data.conversion_rates)) {
        console.error('Target currency not found in rates:', to);
        throw new Error(`Exchange rate not available for ${from} to ${to}`);
      }
      
      const rate = data.conversion_rates[to];
      if (!rate || rate <= 0) {
        console.error('Invalid rate value:', rate);
        throw new Error(`Invalid exchange rate received for ${from} to ${to}`);
      }

      const convertedAmount = (parseFloat(amount) * rate).toFixed(2);
      console.log('Conversion successful:', amount, from, '=', convertedAmount, to);
      
      // Update result
      setResult(convertedAmount);
      
      // Add to history using Redux
      dispatch(addConversion({
        id: uuidv4(),
        fromCurrency: from,
        toCurrency: to,
        amount: amount,
        result: convertedAmount,
        timestamp: Date.now()
      }));
      
    } catch (err) {
      setError('Failed to fetch exchange rate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to get initial exchange rate only if amount is entered
  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      getExchangeRate();
    }
  }, [from, to]);

  // Handle currency exchange
  const handleExchange = () => {
    setFrom(to);
    setTo(from);
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="wrapper">
        <header>Currency Converter</header>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="amount">
            <p>Enter Amount</p>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="drop-list">
            <div className="from">
              <p>From</p>
              <div className="select-box">
                <img 
                  src={`https://flagcdn.com/48x36/${country_list[from].toLowerCase()}.png`} 
                  alt={`${from} flag`}
                />
                <select 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  {Object.keys(country_list).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="icon" onClick={handleExchange}>
              <FontAwesomeIcon icon={faExchangeAlt} />
            </div>
            <div className="to">
              <p>To</p>
              <div className="select-box">
                <img 
                  src={`https://flagcdn.com/48x36/${country_list[to].toLowerCase()}.png`} 
                  alt={`${to} flag`}
                />
                <select 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  {Object.keys(country_list).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="exchange-rate" style={{ color: '#333' }}>
            {loading 
              ? "Getting exchange rate..." 
              : result
                ? `${amount} ${from} = ${result} ${to}`
                : "Enter an amount and click 'Get Exchange Rate'"
            }
          </div>
          <button 
            onClick={getExchangeRate}
            disabled={loading || !amount || isNaN(parseFloat(amount))}
          >
            Get Exchange Rate
          </button>
        </form>
      </div>

      <ConversionHistory />
    </div>
  );
}

export default CurrencyConverter;
