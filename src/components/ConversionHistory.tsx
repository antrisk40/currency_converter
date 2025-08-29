import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { ConversionEntry } from '../features/history/historyTypes';
import './ConversionHistory.css';

function ConversionHistory() {
  const history = useSelector((state: RootState) => state.history.entries);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="conversion-history">
      <h3>Conversion History</h3>
      <div className="history-list">
        {history.map((entry: ConversionEntry) => (
          <div key={entry.id} className="history-item">
            <div className="conversion-details">
              {entry.amount} {entry.fromCurrency} → {entry.result} {entry.toCurrency}
            </div>
            <div className="conversion-time">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversionHistory;
