import { createSlice } from '@reduxjs/toolkit';

const ExpoSlice = createSlice({
  name: 'ExpoSlice',
  initialState: {
    expo: {},
    error: {}
  },
  reducers: {
    setExpo: (state, action) => {
      state.expo = { ...state.expo, ...action.payload };
    },
    clearExpo: (state) => {
      state.expo = {};
    },
    setError: (state, action) => {
      state.error = { ...state.error, ...action.payload };
    }
  }
});

export const { setExpo, clearExpo, setError } = ExpoSlice.actions;

export default ExpoSlice.reducer;
