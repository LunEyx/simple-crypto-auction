import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { connectToMetamask, connectToBinance, joinMetamaskAuction, joinBinanceAuction } from './connectWallet';

const initialState = {
  accounts: [],
  connectedMetamask: false,
  connectedBinance: false,
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

export const joinAuction = createAsyncThunk(
  'wallet/joinAuction',
  async (bidAmount, { getState }) => {
    const state = getState();
    if (state.wallet.connectedMetamask) {
      return await joinMetamaskAuction(bidAmount)
    } else if (state.wallet.connectedBinance) {
      return await joinBinanceAuction(bidAmount)
    }
  });

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
      })
      .addCase(joinAuction.fulfilled, (state, action) => {
        state.connectionStatus = action.payload;
      })
      .addCase(joinAuction.rejected, (state, action) => {
        state.connectionStatus = action.error.message;
      });
  },
});

export const selectWallet = (state) => state.wallet;

export default walletSlice.reducer;