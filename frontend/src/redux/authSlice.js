import { createSlice } from '@reduxjs/toolkit';

/* =========================
   INITIAL STATE (FROM STORAGE)
========================= */
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const organization = localStorage.getItem('organization');

const initialState = {
  token: token || null,
  role: role || null,
  organization: organization || null, // ✅ REQUIRED FOR HEADADMIN
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

/* =========================
   SLICE
========================= */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /* =========================
       LOGIN SUCCESS
    ========================= */
    loginSuccess: (state, action) => {
      const { token, role, organization } = action.payload;

      state.token = token;
      state.role = role;
      state.organization = organization || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // 🔥 persist
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (organization) {
        localStorage.setItem('organization', organization);
      } else {
        localStorage.removeItem('organization');
      }
    },

    /* =========================
       LOGOUT
    ========================= */
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.organization = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('organization');
    },

    /* =========================
       AUTH ERROR (OPTIONAL)
    ========================= */
    authError: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Authentication failed';
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout, authError } = authSlice.actions;
export default authSlice.reducer;
