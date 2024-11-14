import { createSlice } from "@reduxjs/toolkit";
import  { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { AppDispatch } from '@/lib/store'; 


const url = process.env.baseUrl || "http://localhost:3000/";
interface UserInfo {
    email: string;
    password: string;
  }
const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentUser : sessionStorage.getItem("name") || null,
        token: sessionStorage.getItem("token") || null,
        email: sessionStorage.getItem("email") || null,
        role: sessionStorage.getItem("role") || null,
    },
    reducers: {
        auth:(state, action) => {
            state.currentUser = action.payload.name;
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.role = action.payload.role;
        }
    },
    });


export const login = (userInfo: UserInfo, router: ReturnType<typeof useRouter>) => async (dispatch:AppDispatch) => {

    try {
    const res = await fetch(`${url}api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
    });

    const data = await res.json();
    console.log("Data:", data);

    if (!data.success) throw  Error('Login failed');

    const playload = {
        id: data.data.id,
        token : data.token,
        currentUser: data.data.name,
        email: data.data.email,
        role: data.data.role,
    };

    dispatch(authSlice.actions.auth(playload)); 
    sessionStorage.setItem("name", data.data.name);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("email", data.data.email);
    sessionStorage.setItem("role", data.data.role);
    router.push("/home");

    toast.success("User logged in successfully");
 } catch (error) {
        console.error("Error logging in:", error);
        toast.error("An error occurred. Please try again.");
    }
}


export const register = (userInfo: UserInfo, router: ReturnType<typeof useRouter>) => async (dispatch:AppDispatch) => {
    try {
        const res = await fetch(`${url}api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
        });

        const data = await res.json();
        console.log("Data:", data);

        if (!data.success) throw Error('Registration failed');

        const playload = {
            id: data.data.id,
            token: data.token,
            currentUser: data.data.name,
            email: data.data.email,
            role: data.data.role,
        };

        dispatch(authSlice.actions.auth(playload));
        sessionStorage.setItem("name", data.data.name);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("email", data.data.email);
        sessionStorage.setItem("role", data.data.role);
        router.push("/home");

        toast.success("User registered successfully");
    } catch (error) {
        console.error("Error registering:", error);
        toast.error("An error occurred. Please try again.");
    }
}


export const logout = (router: ReturnType<typeof useRouter>) => async (dispatch:AppDispatch) => {
    dispatch(authSlice.actions.auth({}));
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    router.push("/");

    toast.success("User logged out successfully");
}

export const changePassword = () => async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(`${url}api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(userInfo),
      });
  
      const data = await res.json();
      console.log("Data:", data);
  
      if (!data.success) throw new Error('Password change failed');
  
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  export const UserProfile = (userInfo: UserInfo) => async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(`${url}api/users/${userInfo.id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        const data = await res.json();
        console.log("Data:", data);

        if (!data.success) throw new Error('User profile fetch failed');

        const playload = {
            id: data.data.id,
            email: data.data.email,
            role: data.data.role,
        };

        dispatch(authSlice.actions.auth(playload));
        sessionStorage.setItem("email", data.data.email);
        sessionStorage.setItem("role", data.data.role);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("An error occurred. Please try again.");
    }
    }


export default authSlice.reducer;