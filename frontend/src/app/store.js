import { configureStore } from '@reduxjs/toolkit';
import recordReducer from '../features/record/recordSlice';
import walletReducer from '../features/wallet/walletSlice';

export const store = configureStore({
  reducer: {
    record: recordReducer,
    wallet: walletReducer,
  },
});
