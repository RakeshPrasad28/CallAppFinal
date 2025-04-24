import { configureStore } from '@reduxjs/toolkit';
import callLogReducer from './slice/callLogSlice';

export const store = configureStore({
  reducer: {
    callLogs: callLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
