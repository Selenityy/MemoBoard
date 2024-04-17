import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMemos = createAsyncThunk(
  "/memo/fetchMemos",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch("http://localhost:3001/dashboard/memos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed fetch to get all memos");
      }
      return data.parentMemos;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  byId: {},
  allIds: [],
  parentMemos: [],
  childrenMemos: [],
  currentMemo: null,
  status: "idle",
  error: null,
};

const defaultMemo = {
  _id: "",
  body: "",
  user: "", // reference to user id
  dueDateTime: null,
  progress: "Not Started",
  tags: [], // array of tag ids
  priority: null,
  notes: "",
  parentId: null, // if parent id, then not null and use id
};

export const memoSlice = createSlice({
  name: "memo",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMemos.fulfilled, (state, action) => {
        state.allIds = action.payload.map((memo) => memo._id);
        action.payload.forEach((memo) => {
          state.byId[memo._id] = memo;
        });
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchMemos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default memoSlice.reducer;
