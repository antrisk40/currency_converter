import { configureStore } from '@reduxjs/toolkit';
import historyReducer from '../features/history/historySlice';

export const store = configureStore({
  reducer: {
    history: historyReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;