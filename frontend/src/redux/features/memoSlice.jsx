import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

// GET ALL MEMOS
export const fetchAllMemos = createAsyncThunk(
  "/dashboard/memos/fetchAllMemos",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos/all-memos`,
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
        throw new Error(data.message || "Failed to fetch all memos");
      }
      if (data.memos) {
        return data.memos;
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

// GET ALL PARENT MEMOS
export const fetchMemos = createAsyncThunk(
  "/dashboard/memos/fetchMemos",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos`,
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
        throw new Error(data.message || "Failed to fetch memos");
      }
      if (data.parentMemos) {
        return data.parentMemos;
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

// GET ONE PARENT MEMO
export const fetchMemo = createAsyncThunk(
  "/dashboard/memos/fetchMemo",
  async (memoId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos/${memoId}`,
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

// GET ALL CHILDREN MEMOS OF A PARENT MEMO
export const fetchChildrenMemos = createAsyncThunk(
  "/dashboard/memos/fetchChildrenMemos",
  async (memoId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos/${memoId}/children`,
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

// CREATE A MEMO
export const createMemo = createAsyncThunk(
  "/dashboard/memos/create",
  async (formData, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const completeData = { ...defaultMemo, ...formData };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create a memo");
      }
      if (data.newMemo) {
        return data.newMemo;
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

// UPDATE A MEMO
export const updateMemo = createAsyncThunk(
  "/dashboard/memos/update",
  async ({ formData, memoId }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos/${memoId}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      // console.log("data memo slice:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to update memo");
      }
      if (data.updatedMemo) {
        return data.updatedMemo;
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

// DELETE A MEMO
export const deleteMemo = createAsyncThunk(
  "/dashboard/memos/delete",
  async (memoId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos/${memoId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // const data = response.json();
      // const data = JSON.parse(response);
      // console.log("data:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete memo");
      }
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const synchronizeMemos = createAsyncThunk(
  "memos/synchronizeMemos",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/memos/all-memos`,
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
        throw new Error(data.message || "Failed to synchronize memos");
      }
      // console.log("data:", data);
      return data.memos; // Assuming the backend returns an array of all current memos
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  byId: {},
  allIds: [],
  parentMemos: [],
  childrenMemos: {},
  currentMemo: defaultMemo,
  status: "idle",
  error: null,
};

// const defaultMemo = {
//   _id: "",
//   body: "",
//   user: "", // reference to user id
//   dueDateTime: null,
//   progress: "Not Started",
//   tags: [], // array of tag ids
//   priority: null,
//   notes: "",
//   parentId: null, // if parent id, then not null and use id
// };

export const memoSlice = createSlice({
  name: "memo",
  initialState,
  extraReducers: (builder) => {
    builder
      // GET ALL MEMOS
      .addCase(fetchAllMemos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllMemos.fulfilled, (state, action) => {
        action.payload.forEach((memo) => {
          state.byId[memo._id] = memo;
          if (!state.allIds.includes(memo._id)) {
            state.allIds.push(memo._id);
          }
        });
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchAllMemos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

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
      })

      // CREATE MEMO
      .addCase(createMemo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMemo.fulfilled, (state, action) => {
        const newMemo = action.payload;
        state.byId[newMemo._id] = newMemo;
        state.allIds.push(newMemo._id);
        state.currentMemo = newMemo._id;
        if (newMemo.parentId === null) {
          state.parentMemos.push(newMemo._id);
        } else {
          if (!state.childrenMemos[newMemo.parentId]) {
            state.childrenMemos[newMemo.parentId] = [];
          }
          state.childrenMemos[newMemo.parentId].push(newMemo._id);
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createMemo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE MEMO
      .addCase(updateMemo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMemo.fulfilled, (state, action) => {
        const updatedMemo = action.payload;
        state.byId[updatedMemo._id] = updatedMemo;
        if (!state.allIds.includes(updateMemo._id)) {
          state.allIds.push(updatedMemo._id);
        }
        state.currentMemo = updatedMemo._id;
        if (updatedMemo.parentId === null) {
          state.parentMemos.push(updatedMemo._id);
        } else {
          if (!state.childrenMemos[updatedMemo.parentId]) {
            state.childrenMemos[updatedMemo.parentId] = [];
          }
          state.childrenMemos[updatedMemo.parentId].push(updatedMemo._id);
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateMemo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // DELETE MEMO
      .addCase(deleteMemo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMemo.fulfilled, (state, action) => {
        // console.log("it was fulfilled:", action.meta.arg);
        const memoId = action.meta.arg;

        // Remove the memo from allIds array
        state.allIds = state.allIds.filter((id) => id !== memoId);

        // Remove the memo from the byId object
        delete state.byId[memoId];

        // If it's a parent memo, remove it from the parentMemos list
        state.parentMemos = state.parentMemos.filter((id) => id !== memoId);

        // Remove from childrenMemos lists if it's a child memo
        Object.keys(state.childrenMemos).forEach((parentId) => {
          state.childrenMemos[parentId] = state.childrenMemos[parentId].filter(
            (id) => id !== memoId
          );
        });

        // Reset currentMemo if it was the deleted memo
        if (state.currentMemo === memoId) {
          state.currentMemo = defaultMemo; // Reset to default or null based on your initial state setup
        }

        // if (memoIndex > -1) {
        //   state.allIds.splice(memoIndex, 1);
        //   delete state.byId[memoId];
        //   // If it's a parent memo, remove from parentMemos list
        //   if (!memo.parentId) {
        //     state.parentMemos = state.parentMemos.filter((id) => id !== memoId);
        //   } else {
        //     // If it's a child memo, remove from the respective parent's children list
        //     const siblings = state.childrenMemos[memo.parentId];
        //     if (siblings) {
        //       state.childrenMemos[memo.parentId] = siblings.filter(
        //         (id) => id !== memoId
        //       );
        //     }
        //   }
        //   // Remove from allIds and byId
        //   state.allIds = state.allIds.filter((id) => id !== memoId);
        //   delete state.byId[memoId];
        //   // Reset currentMemo if it was the deleted memo
        //   if (state.currentMemo === memoId) {
        //     state.currentMemo = defaultMemo;
        //   }
        // }

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteMemo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(synchronizeMemos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(synchronizeMemos.fulfilled, (state, action) => {
        // Reset the state
        state.byId = {};
        state.allIds = [];
        state.parentMemos = [];
        state.childrenMemos = {};

        // Fill state with fresh data from the backend
        action.payload.forEach((memo) => {
          state.byId[memo._id] = memo;
          state.allIds.push(memo._id);
          if (memo.parentId === null) {
            state.parentMemos.push(memo._id);
          } else {
            if (!state.childrenMemos[memo.parentId]) {
              state.childrenMemos[memo.parentId] = [];
            }
            state.childrenMemos[memo.parentId].push(memo._id);
          }
        });

        state.status = "succeeded";
        state.error = null;
      })
      .addCase(synchronizeMemos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default memoSlice.reducer;
