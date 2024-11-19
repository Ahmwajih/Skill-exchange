import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";

const baseUrl = process.env.baseUrl || "http://localhost:3000/";

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  photo?: string;
  userId: string;
}

interface SkillState {
  data: Skill[];
}

const initialState: SkillState = {
  data: [],
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
    readSkill: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((skill) => skill._id === action.payload);
    },
  },
});

export const { getSkills, createSkill, updateSkill, deleteSkill, readSkill } = skillSlice.actions;

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

export default skillSlice.reducer;