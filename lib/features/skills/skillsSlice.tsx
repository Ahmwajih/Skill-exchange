import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";

const baseUrl = process.env.baseUrl || "http://localhost:3000/";

const token = sessionStorage.getItem("token") || null;
// Define a type for a Skill
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

export const getSkills = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${baseUrl}api/skills`);
    const data = await res.json();

    if (res.status == 200) {
      dispatch(skillSlice.actions.getSkills(data.data));
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const createSkill = (skill: Skill) => async (dispatch: AppDispatch) => {
  try {
    const token = sessionStorage.getItem("token"); 
    const res = await fetch(`${baseUrl}api/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify(skill),
    });

    const data = await res.json();
    if (res.status == 200) {
      dispatch(skillSlice.actions.createSkill(data.data));
      toast.success("Skill created successfully");
    }
  } catch (error) {
    toast.error(error.message);
  }
};


export const updateSkill = (skill: Skill) => async (dispatch: AppDispatch) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${baseUrl}api/skills/${skill._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify(skill),
    });

    const data = await res.json();
    if (res.status == 200) {
      dispatch(skillSlice.actions.updateSkill(data.data));
      toast.success("Skill updated successfully");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const deleteSkill = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${baseUrl}api/skills/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (res.status == 200) {
      dispatch(skillSlice.actions.deleteSkill(id));
      toast.success("Skill deleted successfully");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const readSkill = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${baseUrl}api/skills/${id}`);
    const data = await res.json();

    if (res.status == 200) {
      dispatch(skillSlice.actions.readSkill(data.data));
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export default skillSlice.reducer;



