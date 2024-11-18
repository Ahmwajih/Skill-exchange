import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/features/auth/authSlice";
import userReducer from "@/lib/features/dashboard/userSlice";
import skillReducer from "@/lib/features/skills/skillsSlice";
import categoryReducer from "@/lib/features/skills/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    skill: skillReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;