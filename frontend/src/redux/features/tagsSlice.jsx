import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// GET ALL TAGS
export const fetchTags = createAsyncThunk(
  "/dashboard/tags",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch("http://localhost:3001/dashboard/tags", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed fetch to get all tags");
      }
      return data.tags;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// CREATE TAG
export const createTag = createAsyncThunk(
  "/dashboard/tags/create",
  async ({ tagId, formData }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/tags/${tagId}/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create tag");
      }
      if (data.newTag) {
        return data.newTag;
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

// UPDATE TAG
export const updateTag = createAsyncThunk(
  "/dashboard/tags/update",
  async ({ tagId, formData }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/tags/${tagId}/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update tag");
      }

      if (data.updatedTag) {
        return data.updatedTag;
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

// DELETE TAG
export const deleteTag = createAsyncThunk(
  "/dashboard/memos/delete",
  async (tagId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/tags/${tagId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete tag");
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
  status: "idle",
  error: null,
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  extraReducers: (builder) => {
    builder
      // GET ALL TAGS
      .addCase(fetchTags.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        action.payload.forEach((tag) => {
          state.byId[tag._id] = tag;
          if (!state.allIds.includes(tag._id)) {
            state.allIds.push(tag._id);
          }
        });
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CREATE A TAG
      .addCase(createTag.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTag.fulfilled, (state, action) => {
        const newTag = action.payload;
        state.byId[newTag._id] = newTag;
        state.allIds.push(newTag._id);

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE A TAG
      .addCase(updateTag.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        const updateTag = action.payload;
        state.byId[updateTag._id] = updateTag;
        if (!state.allIds.includes(updateTag._id)) {
          state.allIds.push(updateTag._id);
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // DELETE A TAG
      .addCase(deleteTag.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        const tagId = action.meta.arg;
        delete state.byId[tagId];
        state.allIds = state.allIds.filter((id) => id !== tagId);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default tagsSlice.reducer;
