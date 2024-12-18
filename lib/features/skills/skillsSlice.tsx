import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";
import Fuse from 'fuse.js';


// Remove the unused User interface
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   country: string;
// }

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
  data: Skill[] | null;
  filteredSkills: Skill[];
  selectedSkill?: Skill;
  searchResults: Skill[];
  selectedCountry: string;
  loading: boolean;
  error: string | null;
}

const initialState: SkillState = {
  data: null,
  filteredSkills: [],
  searchResults: [],
  selectedSkill: null,
  selectedCountry: "All",
  loading: false,
  error: null,
};

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    getSkills: (state, action: PayloadAction<Skill[]>) => {
      state.data = action.payload;
      state.searchResults = action.payload; // Reset search results when fetching skills
    },
    createSkill: (state, action: PayloadAction<Skill>) => {
      if (!state.data) {
        state.data = []; // Initialize state.data if it is null
      }
      state.data.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<Skill>) => {
      if (!state.data) {
        state.data = []; // Initialize state.data if it is null
      }
      const index = state.data.findIndex(
        (skill) => skill._id === action.payload._id
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      if (!state.data) {
        state.data = []; // Initialize state.data if it is null
      }
      state.data = state.data.filter((skill) => skill._id !== action.payload);
    },
    readSkill: (state, action: PayloadAction<Skill>) => {
      state.selectedSkill = action.payload;
    },
    filterSkillsByCountry: (state, action: PayloadAction<string>) => {
      state.selectedCountry = action.payload;
      const country = action.payload;
      if (country === "All") {
        state.filteredSkills = state.searchResults;
      } else {
        state.filteredSkills = state.searchResults.filter(skill => skill.user.country.toLowerCase() === country.toLowerCase());
      }
    },
    setFilteredSkills: (state, action: PayloadAction<Skill[]>) => {
      state.filteredSkills = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Skill[]>) => {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSkill = action.payload;
      })
      .addCase(fetchSkillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { getSkills, createSkill, updateSkill, deleteSkill, readSkill, filterSkillsByCountry, setFilteredSkills, setSearchResults } = skillSlice.actions;

export const fetchSkills = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`/api/skills`);
    const data = await res.json();

    if (res.status === 200) {
      dispatch(getSkills(data.data));
    } else {
      toast.error("Failed to fetch skills");
    }
  } catch {
    toast.error("Error fetching skills");
  }
};

export const fetchSkillById = createAsyncThunk(
  "skills/fetchSkillById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/skills/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch skill");
      }
      return data.data;
    } catch (error) {
      console.error("Error fetching skill:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addSkillToUser = createAsyncThunk(
  'skills/addSkillToUser',
  async (skillData: Partial<Skill>, { dispatch }) => {
    try {
      console.log("Sending skill data:", skillData); // Add logging
      const res = await fetch(`/api/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
      });

      const data = await res.json();
      console.log("Response status:", res.status); // Add logging
      console.log("Response data:", data); // Add logging

      if (res.ok) { // Use res.ok to check for successful response
        dispatch(createSkill(data.data));
        return { success: true, data: data.data };
      } else {
        console.error("Failed to add skill:", data.error || "Unknown error"); // Add logging
        return { success: false, error: data.error || "Failed to add skill" };
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      return { success: false, error: "Error adding skill" };
    }
  }
);

export const searchSkills =
  ({ searchSkill }: { searchSkill: string }, router: NextRouter) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await fetch(`/api/skills`);
      const data = await res.json();
      if (searchSkill) {
        const fuse = new Fuse(data.data, {
          keys: ["title", "description", "category"],
          threshold: 0.3,
        });
        const results = fuse.search(searchSkill).map((result) => result.item);
        dispatch(setSearchResults(results));
      } else {
        dispatch(setSearchResults(data.data));
      }
      router.push("/main"); 
    } catch {
      toast.error("Error fetching filtered skills");
    }
  };

export default skillSlice.reducer;