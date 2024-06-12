import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateProject } from "./projectSlice";

// GET ALL SECTIONS
export const fetchAllSections = createAsyncThunk(
  "/projects/sections",
  async (projectId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}/sections`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("slice all sections:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sections");
      }
      if (data.sections) {
        return data.sections;
      } else {
        return thunkAPI.rejectWithValue({
          message: data.message,
          error: data.errors,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET A SPECIFIC SECTION
export const fetchSection = createAsyncThunk(
  "/projects/section",
  async ({ sectionId, projectId }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}/sections/${sectionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("slice one section:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch section");
      }
      if (data.section) {
        return data.section;
      } else {
        return thunkAPI.rejectWithValue({
          message: data.message,
          error: data.errors,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// CREATE A SECTION
export const createSection = createAsyncThunk(
  "/projects/section/create",
  async ({ projectId, formData }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}/sections/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log("slice data created section", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to create a section");
      }
      if (data.newSection) {
        return data.newSection;
      } else {
        return thunkAPI.rejectWithValue({
          message: data.message,
          error: data.errors,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ADD ONE MEMO TO A SECTION
export const addMemoToSection = createAsyncThunk(
  "section/addMemo",
  async ({ sectionId, projectId, memoId }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}/sections/${sectionId}/memos/${memoId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("slice section add memo:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to update section memo");
      }
      if (data.updatedSectionMemo) {
        return data.updatedSectionMemo;
      } else {
        return thunkAPI.rejectWithValue({
          message: data.message,
          error: data.errors,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ADD MULTIPLE MEMOS TO A SECTION
export const addAllMemosToSection = createAsyncThunk(
  "section/addAllMemo",
  async ({ sectionId, projectId, selectedMemos }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}/sections/${sectionId}/memos`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memoIds: selectedMemos }),
        }
      );
      const data = await response.json();
      console.log("slice section add all memos:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to update section memos");
      }
      if (data.updatedSectionMemos) {
        return data.updatedSectionMemos;
      } else {
        return thunkAPI.rejectWithValue({
          message: data.message,
          error: data.errors,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// UPDATE A SECTION
export const updateSection = createAsyncThunk(
  "/projects/section/update",
  async ({ sectionId, projectId, sectionData }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}/sections/${sectionId}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sectionData),
        }
      );
      const data = response.json();
      console.log("slice section update:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to update section");
      }
      if (data.updatedSection) {
        return data.updatedSection;
      } else {
        return thunkAPI.rejectWithValue({
          message: data.message,
          error: data.errors,
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// DELETE A SECTION
export const deleteSection = createAsyncThunk(
  "/projects/section/delete",
  async ({ sectionId, projectId }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}/sections/${sectionId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("slice deleted section:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete section");
      }
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  byId: {},
  allIds: [],
  currentSection: null,
  status: "idle",
  error: null,
};

export const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    removeAllSections: (state) => {
      state.byId = {};
      state.allIds = [];
      console.log("removed");
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL SECTIONS
      .addCase(fetchAllSections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllSections.fulfilled, (state, action) => {
        state.allIds = action.payload.map((section) => section._id);
        action.payload.forEach((section) => {
          state.byId[section._id] = section;
        });
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchAllSections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH ONE SECTION
      .addCase(fetchSection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSection.fulfilled, (state, action) => {
        const section = action.payload;
        state.byId[section._id] = section;
        if (!state.allIds.includes(section._id)) {
          state.allIds.push(section._id);
        }
        state.currentSection = section._id;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CREATE SECTION
      .addCase(createSection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSection.fulfilled, (state, action) => {
        const newSection = action.payload;
        if (!state.allIds.includes(newSection._id)) {
          state.allIds.push(newSection._id);
        }
        state.byId[newSection._id] = newSection;
        state.currentSection = newSection._id;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ADD MEMO TO SECTION
      .addCase(addMemoToSection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addMemoToSection.fulfilled, (state, action) => {
        const updatedSection = action.payload;
        // check is section already exists
        if (state.byId[updatedSection._id]) {
          // update the section directly
          state.byId[updatedSection._id].memos = updatedSection.memos;
        } else {
          state.byId[updatedSection._id] = updatedSection;
          if (!state.allIds.includes(updatedSection._id)) {
            state.allIds.push(updatedSection._id);
          }
        }
        state.currentSection = updatedSection._id;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addMemoToSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ADD ALL MEMOS TO A SECTION
      .addCase(addAllMemosToSection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAllMemosToSection.fulfilled, (state, action) => {
        const updatedSection = action.payload;
        // check is section already exists
        if (state.byId[updatedSection._id]) {
          // update the section directly
          state.byId[updatedSection._id].memos = updatedSection.memos;
        } else {
          state.byId[updatedSection._id] = updatedSection;
          if (!state.allIds.includes(updatedSection._id)) {
            state.allIds.push(updatedSection._id);
          }
        }
        state.currentSection = updatedSection._id;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addAllMemosToSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE SECTION
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const section = action.payload;
        state.byId[section._id] = section;
        if (!state.allIds.includes(section._id)) {
          state.allIds.push(section._id);
        }
        state.currentSection = section._id;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // DELETE SECTION
      .addCase(deleteSection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        const sectionId = action.meta.arg; // assumes the sectionId was passed as the argument to the thunk
        state.allIds = state.allIds.filter((id) => id !== sectionId);
        delete state.byId[sectionId];
        if (state.currentSection === sectionId) {
          state.currentSection = null;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { removeAllSections } = sectionSlice.actions;
export default sectionSlice.reducer;
