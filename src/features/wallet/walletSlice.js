import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { connectToMetamask, connectToBinance } from './connectWallet';

const initialState = {
  accounts: [],
  connectedMetamask: false,
  connectedBinance: false,
  etherUnit: "1000000000000000000",
  connectedAccount: 'Not Connected',
  connectionStatus: 'Not Connected',
};

export const connectMetamask = createAsyncThunk(
  'wallet/connectMetamask',
  connectToMetamask
);

export const connectBinance = createAsyncThunk(
  'wallet/connectBinance',
  connectToBinance
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectMetamask.fulfilled, (state, action) => {
        state.connectedMetamask = true;
        state.connectionStatus = 'Connected to Metamask';
        state.connectedAccount = action.payload;
      })
      .addCase(connectMetamask.rejected, (state, action) => {
        state.connectionStatus = 'User denied account access';
      })
      .addCase(connectBinance.fulfilled, (state, action) => {
        state.connectedMetamask = true;
        state.connectionStatus = 'Connected to Binance';
        state.connectedAccount = action.payload;
      })
      .addCase(connectBinance.rejected, (state, action) => {
        state.connectionStatus = 'User denied account access';
      });
  },
});

export const selectWallet = (state) => state.wallet;

export default walletSlice.reducer;