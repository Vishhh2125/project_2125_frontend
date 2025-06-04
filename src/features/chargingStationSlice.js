import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// CREATE
export const createChargingStation = createAsyncThunk(
  'chargingStations/create',
  async (stationData) => {
    try {
      const response = await api.post('charging-stations', stationData);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }
);

// READ (GET ALL)
export const fetchChargingStations = createAsyncThunk(
  'chargingStations/fetchAll',
  async () => {
    try {
      const response = await api.get('charging-stations');
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }
);

// UPDATE (PUT)
export const updateChargingStation = createAsyncThunk(
  'chargingStations/update',
  async ({ id, stationData }) => {
    try {
      const response = await api.put(`charging-stations/${id}`, stationData);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }
);

// DELETE
export const deleteChargingStation = createAsyncThunk(
  'chargingStations/delete',
  async (id) => {
    try {
      await api.delete(`charging-stations/${id}`);
      return id;
    } catch (err) {
      throw err;
    }
  }
);

const chargingStationSlice = createSlice({
  name: 'chargingStations',
  initialState: {
    stations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createChargingStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChargingStation.fulfilled, (state, action) => {
        state.loading = false;
        state.stations.push(action.payload);
      })
      .addCase(createChargingStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // READ
      .addCase(fetchChargingStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChargingStations.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchChargingStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE
      .addCase(updateChargingStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChargingStation.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.stations.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.stations[idx] = action.payload;
      })
      .addCase(updateChargingStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE
      .addCase(deleteChargingStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChargingStation.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = state.stations.filter(s => s._id !== action.payload);
      })
      .addCase(deleteChargingStation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chargingStationSlice.reducer;