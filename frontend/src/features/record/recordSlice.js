import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addressDictionary: {},
};

export const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {
    setAddressDictionary(state, action) {
      state.addressDictionary = action.payload
    }
  },
});

export const selectRecord = (state) => state.record;

export default recordSlice.reducer;