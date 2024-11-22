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
  skill_exchanges: string[];
  reviews: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isAdmin: boolean;
}

interface UserState {
  users: User[];
  filteredUsers: User[];
}

const initialState: UserState = {
  users: [],
  filteredUsers: [],
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
  },
});

export const { setUsers, filterUsersByCountry, searchUsersByName } = userSlice.actions;

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

export default userSlice.reducer;