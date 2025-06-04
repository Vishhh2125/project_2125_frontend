import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api.js';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {

      const response = await api.post('users/login', data);

      // Save token to localStorage
      if (response.data?.data?.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
      }

      return response.data.data.user;

    } catch (error) {
      console.log("hi");

      const status = error?.response?.status;
      const message = error?.response?.data?.message ;

      return rejectWithValue({ status, message });
    }
  }
);


export const register = createAsyncThunk(
  'auth/register',
  async (data) => {
    try {
      const response = await api.post('users/register', data);
      console.log('Registration error:', response.data);
      return response.data;
    } catch (err) {
      console.log('Registration error:', err);
      
      throw err;
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`users/logout/${id}`);
      // Remove token from localStorage
      localStorage.removeItem('token');
      console.log('Logout successful');
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      return rejectWithValue({ status, message });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async () => {
    try {
      const response = await api.get('users/current-user');
      return response.data;
    } catch (err) {
      throw err;
    }
  }
);

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      // .addCase(register.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(register.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.user = action.payload ;
      //   state.isAuthenticated = true;
      //   state.error = null;
      // })
      // .addCase(register.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   state.isAuthenticated = false;
      // })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('token'); // <-- always remove token here
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        localStorage.removeItem('token'); // <-- also remove token on error
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Current user fetched:', action.payload);
        state.user = action.payload.data
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { resetAuthError } = authSlice.actions;
export default authSlice.reducer;