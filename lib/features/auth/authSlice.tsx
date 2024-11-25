import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";
import { useRouter } from "next/router";

const url = process.env.baseUrl || "http://localhost:3000/";

interface UserInfo {
  email: string;
  password: string;
}

interface PasswordChangeInfo {
  currentPassword: string;
  newPassword: string;
}

interface UserProfileInfo {
  id: string;
}

interface AuthState {
  currentUser: string | null;
  token: string | null;
  email: string | null;
  role: string | null;
}

const initialState: AuthState = {
  currentUser: typeof window !== "undefined" ? sessionStorage.getItem("name") : null,
  token: typeof window !== "undefined" ? sessionStorage.getItem("token") : null,
  email: typeof window !== "undefined" ? sessionStorage.getItem("email") : null,
  role: typeof window !== "undefined" ? sessionStorage.getItem("role") : null,
  isAuthenticated: typeof window !== "undefined" ? !!sessionStorage.getItem("token") : false,

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    auth: (state, action: PayloadAction<{ name: string; token: string; email: string; role: string }>) => {
      state.currentUser = action.payload.name;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { auth, logout } = authSlice.actions;
export default authSlice.reducer;

export const login = (userInfo: UserInfo, router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Login failed");
    }

    const payload = {
      name: data.data.name,
      token: data.token,
      email: data.data.email,
      role: data.data.role,
    };

    dispatch(auth(payload));

    if (typeof window !== "undefined") {
      sessionStorage.setItem("name", data.data.name);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", data.data.email);
      sessionStorage.setItem("role", data.data.role);
    }

    router.push("/main");
    toast.success("User logged in successfully");
  } catch (error) {
    console.error("Error logging in:", error);
    toast.error("Login failed. Please try again.");
  }
};


export const register = (userInfo: UserInfo, router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const data = await res.json();

    if (!data.success) throw new Error("Registration failed");

    const payload = {
      name: data.data.name,
      token: data.token,
      email: data.data.email,
      role: data.data.role,
    };

    dispatch(auth(payload));

    if (typeof window !== "undefined") {
      sessionStorage.setItem("name", data.data.name);
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", data.data.email);
      sessionStorage.setItem("role", data.data.role);
    }

    router.push("/main");
    toast.success("User registered successfully");
  } catch (error) {
    console.error("Error registering:", error);
    toast.error("An error occurred. Please try again.");
  }
};


export const logoutUser = (router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}api/logout`, {
      method: "POST",
      headers: {
        Authorization: `token ${typeof window !== "undefined" ? sessionStorage.getItem("token") : ""}`,
      },
    });

    if (res.status === 200 || res.status === 204) {
      dispatch(logout());

      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }

      router.push("/");
      toast.success("User logged out successfully");
    }
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error("An error occurred. Please try again.");
  }
};


export const changePassword = (id: string, passwordChangeInfo: PasswordChangeInfo) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}api/users/change-password/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${typeof window !== "undefined" ? sessionStorage.getItem("token") : ""}`,
      },
      body: JSON.stringify(passwordChangeInfo),
    });

    const data = await res.json();
    console.log("Data:", data);

    if (!data.success) throw new Error("Password change failed");

    toast.success("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    toast.error("An error occurred. Please try again.");
  }
};

export const fetchUserProfile = (userInfo: UserProfileInfo) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}api/users/${userInfo.id}`, {
      method: "GET",
      headers: {
        Authorization: `token ${typeof window !== "undefined" ? sessionStorage.getItem("token") : ""}`,
      },
    });

    const data = await res.json();
    console.log("Data:", data);

    if (!data.success) throw new Error("User profile fetch failed");

    const payload = {
      name: data.data.name,
      email: data.data.email,
      role: data.data.role,
    };

    dispatch(auth(payload));
    if (typeof window !== "undefined") {
      sessionStorage.setItem("name", data.data.name);
      sessionStorage.setItem("email", data.data.email);
      sessionStorage.setItem("role", data.data.role);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error("An error occurred while fetching the profile. Please try again.");
  }
};