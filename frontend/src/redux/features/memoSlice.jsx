import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// GET ALL PARENT MEMOS
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
        throw new Error(data.message || "Failed to fetch memos");
      }
      if (data.parentMemos) {
        return data.parentMemos;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET ONE PARENT MEMO
export const fetchMemo = createAsyncThunk(
  "/memo/fetchMemo",
  async (memoId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3001/dashboard/memos/${memoId}`,
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
        throw new Error(data.message || "Failed to fetch memo");
      }
      if (data.parentMemo) {
        return data.parentMemo;
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// GET ALL CHILDREN MEMOS OF A PARENT MEMO
export const fetchChildrenMemos = createAsyncThunk(
  "/memo/fetchChildrenMemos",
  async (memoId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3001/dashboard/memos/${memoId}/children`,
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
        throw new Error(data.message || "Failed to fetch children memos");
      }
      if (data.childMemos) {
        return { parentId: memoId, children: data.childMemos };
      } else {
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// CREATE A MEMO

// UPDATE A MEMO

// DELETE A MEMO

const initialState = {
  byId: {},
  allIds: [],
  parentMemos: [],
  childrenMemos: {},
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
      // GET ALL PARENT MEMOS
      .addCase(fetchMemos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMemos.fulfilled, (state, action) => {
        state.parentMemos = action.payload.map((memo) => memo._id);
        action.payload.forEach((memo) => {
          state.byId[memo._id] = memo;
          if (!state.allIds.includes(memo._id)) {
            state.allIds.push(memo._id);
          }
        });
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchMemos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // GET ONE PARENT MEMOS
      .addCase(fetchMemo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMemo.fulfilled, (state, action) => {
        const memo = action.payload;
        state.byId[memo._id] = memo;
        if (!state.allIds.includes(memo._id)) {
          state.allIds.push(memo._id);
          if (memo.parentId === null) {
            state.parentMemos.push(memo._id);
          }
        }
        state.currentMemo = memo._id;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchMemo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // GET ALL CHILDREN MEMOS OF A PARENT MEMO
      .addCase(fetchChildrenMemos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChildrenMemos.fulfilled, (state, action) => {
        const { parentId, children } = action.payload;
        if (!state.childrenMemos[parentId]) {
          state.childrenMemos[parentId] = [];
        }
        children.forEach((child) => {
          state.byId[child._id] = child;
          if (!state.allIds.includes(child._id)) {
            state.allIds.push(child._id);
          }
          state.childrenMemos[parentId].push(child._id);
        });
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchChildrenMemos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default memoSlice.reducer;
