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
  photo: string;
  user: {
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SkillState {
  data: Skill[];
  filteredSkills: Skill[];
  selectedSkill?: Skill;
  searchResults: Skill[];
}

const initialState: SkillState = {
  data: [],
  filteredSkills: [],
  searchResults: [],
  selectedSkill: null,
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
        state.filteredSkills = state.data.filter(skill => skill.user.country.toLowerCase() === country.toLowerCase());
      }
    },
    setFilteredSkills: (state, action: PayloadAction<Skill[]>) => {
      state.filteredSkills = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Skill[]>) => {
      state.searchResults = action.payload;
    },
  },
});

export const { getSkills, createSkill, updateSkill, deleteSkill, readSkill, filterSkillsByCountry, setFilteredSkills, setSearchResults } = skillSlice.actions;

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

export const addSkillToUser = createAsyncThunk(
  'skills/addSkillToUser',
  async (skillData: Partial<Skill>, { dispatch }) => {
    try {
      const res = await fetch(`${baseUrl}api/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
      });

      const data = await res.json();

      if (res.status === 201) {
        dispatch(createSkill(data.data));
        toast.success("Skill added successfully");
        console.log("Skill added successfully");
      } else {
        toast.error("Failed to add skill");
      }
    } catch (error) {
      toast.error("Error adding skill");
    }
  }
);

export const searchSkills =
  ({ searchSkill }: { searchSkill: string }, router: NextRouter) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(`${baseUrl}/api/skills`);
      const data = await res.json();
      console.log('data', data.data)
      if (searchSkill) {
        const fuse = new Fuse(data.data, {
          keys: ["title", "description", "category"],
          threshold: 0.3,
        });
        const results = fuse.search(searchSkill).map((result) => result.item);
        console.log('results', results)
        dispatch(setSearchResults(results));
      } else {
        dispatch(setSearchResults(data.data));
      }
      router.push("/main"); 
    } catch (error) {
      toast.error("Error fetching filtered skills");
    }
  };

export default skillSlice.reducer;