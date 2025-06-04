import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice'; // Adjust path if needed
import chargingStationReducer from '../features/chargingStationSlice'; // <-- Add this line

const store = configureStore({
  reducer: {
    auth: authReducer,
    chargingStations: chargingStationReducer,
 },
});

export default store;