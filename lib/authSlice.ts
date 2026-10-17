import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null; // access
  refresh: string | null;
}

const initialState: AuthState = { token: null, refresh: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Token doim localStorage'da saqlanadi (remember e'tiborga olinmaydi)
    setToken(
      state,
      action: PayloadAction<{
        token: string;
        refresh?: string | null;
        remember?: boolean;
      }>
    ) {
      const { token, refresh = null } = action.payload;
      state.token = token;
      state.refresh = refresh;

      for (const s of [localStorage, sessionStorage]) {
        s.removeItem("token");
        s.removeItem("refresh");
      }

      // Qayta login so'ralmasligi uchun doim localStorage
      localStorage.setItem("token", token);
      if (refresh) localStorage.setItem("refresh", refresh);
    },

    // Refresh orqali yangilangan access token
    setAccessToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      const storage =
        localStorage.getItem("token") !== null ? localStorage : sessionStorage;
      storage.setItem("token", action.payload);
    },

    logout(state) {
      state.token = null;
      state.refresh = null;
      for (const s of [localStorage, sessionStorage]) {
        s.removeItem("token");
        s.removeItem("refresh");
      }
    },

    hydrate(state) {
      state.token =
        localStorage.getItem("token") ?? sessionStorage.getItem("token");
      state.refresh =
        localStorage.getItem("refresh") ?? sessionStorage.getItem("refresh");
    },
  },
});

export const { setToken, setAccessToken, logout, hydrate } =
  authSlice.actions;
export default authSlice.reducer;