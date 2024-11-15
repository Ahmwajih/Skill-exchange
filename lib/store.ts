import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/features/auth/authSlice";
import userReducer from "@/lib/features/dashboard/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;