import { createSlice } from "@reduxjs/toolkit";

// Load initial user state from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
  isLoggedIn: !!storedUser, // Convert storedUser to boolean
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Store user in localStorage
    },
    logoutUser(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user"); // Remove user from localStorage on logout
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
