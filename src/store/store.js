import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './applicationSlice';
import featureReducer from './featureSlice';

export const store = configureStore({
  reducer: {
    applications: applicationReducer,
    features: featureReducer,
  },
});

export default store;
