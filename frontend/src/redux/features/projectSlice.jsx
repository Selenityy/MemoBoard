import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// GET ALL PROJECTS
export const fetchProjects = createAsyncThunk(
  "/dashboard/projects",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch("http://localhost:3000/dashboard/projects", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }
      if (data.projects) {
        return data.projects;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET ONE PROJECT
export const fetchProject = createAsyncThunk(
  "/dashboard/projects",
  async (projectId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/projects/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch project");
      }
      if (data.project) {
        return data.project;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// CREATE A PROJECT
export const createProject = createAsyncThunk(
  "/dashboard/projects/create",
  async (formData, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        "http://localhost:3000/dashboard/projects/create",
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
      if (!response.ok) {
        throw new Error(data.message || "Failed to create a project");
      }
      if (data.newProject) {
        return data.newProject;
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

// UPDATE A PROJECT
export const updateProject = 

// DELETE A PROJECT

const initialState = {
  byId: {},
  allIds: [],
  currentProject: null,
  status: "idle",
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  extraReducers: (builder) => {
    builder
      // FETCH PROJECTS
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.allIds = action.payload.map((project) => project._id);
        action.payload.forEach((project) => {
          state.byId[project._id] = project;
        });
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH ONE PROJECT
      .addCase(fetchProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        const project = action.payload;
        state.byId[project._id] = project;
        if (!state.allIds.includes(project._id)) {
          state.allIds.push(project._id);
        }
        state.currentProject = project._id;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CREATE PROJECT
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        const newProject = action.payload;
        if (!state.allIds.includes(newProject._id)) {
          state.allIds.push(newProject._id);
        }
        state.byId[newProject._id] = newProject;
        state.currentProject = newProject._id; // set new porject to current project
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
