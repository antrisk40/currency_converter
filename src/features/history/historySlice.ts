import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversionEntry, HistoryState } from './historyTypes';

const loadState = (): HistoryState => {
  try {
    const serializedState = localStorage.getItem('conversionHistory');
    if (serializedState === null) {
      return { entries: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { entries: [] };
  }
};

const initialState: HistoryState = loadState();

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addConversion: (state, action: PayloadAction<ConversionEntry>) => {
      state.entries.unshift(action.payload);
      // Keep only last 10 entries
      state.entries = state.entries.slice(0, 10);
      // Save to localStorage
      localStorage.setItem('conversionHistory', JSON.stringify(state));
    }
  }
});

export const { addConversion } = historySlice.actions;
export default historySlice.reducer;
