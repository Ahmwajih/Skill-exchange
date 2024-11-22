import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";
import Fuse from 'fuse.js';

const baseUrl = process.env.baseUrl || "http://localhost:3000/";

interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
}

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

interface SkillState {
  data: Skill[];
  filteredSkills: Skill[];
  selectedSkill?: Skill;
}

const initialState: SkillState = {
  data: [],
  filteredSkills: [],
};

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    getSkills: (state, action: PayloadAction<Skill[]>) => {
      state.data = action.payload;
    },
    createSkill: (state, action: PayloadAction<Skill>) => {
      state.data.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<Skill>) => {
      const index = state.data.findIndex(
        (skill) => skill._id === action.payload._id
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((skill) => skill._id !== action.payload);
    },
    readSkill: (state, action: PayloadAction<Skill>) => {
      state.selectedSkill = action.payload;
    },
    filterSkillsByCountry: (state, action: PayloadAction<string>) => {
      const country = action.payload;
      if (country === "All") {
        state.filteredSkills = state.data;
      } else {
        state.filteredSkills = state.data.filter(skill => skill.userId.country.toLowerCase() === country.toLowerCase());
      }
    },
    setFilteredSkills: (state, action: PayloadAction<Skill[]>) => {
      state.filteredSkills = action.payload;
    },
  },
});

export const { getSkills, createSkill, updateSkill, deleteSkill, readSkill, filterSkillsByCountry, setFilteredSkills } = skillSlice.actions;

export const fetchSkills = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${baseUrl}api/skills`);
    const data = await res.json();

    if (res.status === 200) {
      dispatch(getSkills(data.data));
    } else {
      toast.error("Failed to fetch skills");
    }
  } catch (error) {
    toast.error("Error fetching skills");
  }
};

export const fetchSkillById = createAsyncThunk(
  'skills/fetchSkillById',
  async (id: string, { dispatch }) => {
    try {
      const res = await fetch(`${baseUrl}api/skills/${id}`);
      const data = await res.json();

      if (res.status === 200) {
        dispatch(readSkill(data));
        return data;
      } else {
        toast.error("Failed to fetch skill");
      }
    } catch (error) {
      toast.error("Error fetching skill");
    }
  }
);

export const searchSkills =
  ({ searchSkill }: { searchSkill: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(`${baseUrl}/api/skills`);
      const data = await res.json();
      if (searchSkill) {
        const fuse = new Fuse(data.data, {
          keys: ["title", "description", "category"],
          threshold: 0.3,
        });
        dispatch(setFilteredSkills(fuse.search(searchSkill).map((result) => result.item)));
      } else {
        dispatch(setFilteredSkills(data.data));
      }
    } catch (error) {
      toast.error("Error fetching filtered skills");
    }
  };

export default skillSlice.reducer;