import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";

const baseUrl = process.env.baseUrl || "http://localhost:3000/";

interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
  role: string;
  skills: string[];
  photo: string;
  reviews: string[];
  skillsLookingFor: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isAdmin: boolean;
}

interface UserState {
  users: User[];
  filteredUsers: User[];
  currentUser?: User | null;
}

const initialState: UserState = {
  users: [],
  filteredUsers: [],
  currentUser: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.filteredUsers = action.payload; 
    },
    filterUsersByCountry: (state, action: PayloadAction<string>) => {
      const country = action.payload;
      if (country === "All") {
        state.filteredUsers = state.users;
      } else {
        state.filteredUsers = state.users.filter(user => user.country.toLowerCase() === country.toLowerCase());
      }
    },
    searchUsersByName: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      state.filteredUsers = state.users.filter((user) =>
        user.name.toLowerCase().includes(query)
      );
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload; 
    },
    clearCurrentUser: (state) => {
      state.currentUser = null; 
    },
  },
});

export const { setUsers, filterUsersByCountry, searchUsersByName, setCurrentUser, clearCurrentUser } = userSlice.actions;

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${baseUrl}api/users`);
    const data = await res.json();

    if (data.success) {
      dispatch(setUsers(data.data));
    } else {
      toast.error(data.error || "Failed to fetch users");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Error fetching users");
  }
};

export const selectedUserById = createAsyncThunk(
  'users/selectedUserById',
  async (id: string, { dispatch }) => {
    try {
      const res = await fetch(`${baseUrl}api/users/${id}`);
      const data = await res.json();

      if (res.status === 200) {
        return data;
      } else {
        toast.error('Failed to fetch user');
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching user');
      throw error;
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'users/updateUserProfile',
  async ({ id, userData }: { id: string; userData: User }, { dispatch }) => {
    try {
      const res = await fetch(`${baseUrl}api/users/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.status === 200) {
        dispatch(setCurrentUser(data.data)); 
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  }
);

export const createUserProfile = createAsyncThunk(
  'users/createUserProfile',
  async ({ id, userData }: { id: string; userData: User }, { dispatch }) => {
    try {
      const res = await fetch(`${baseUrl}api/users/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.status === 200) {
        dispatch(setCurrentUser(data.data)); 
        toast.success("Profile ccreated successfully!");
      } else {
        toast.error(data.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Error creating profile");
    }
  }
);


export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}api/users/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete user');
        return rejectWithValue(error);
      }

      toast.success('User deleted successfully');
      return await res.json(); // Return deleted user data if needed
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
      return rejectWithValue(error.message || 'Unknown error');
    }
  }
);
export default userSlice.reducer;