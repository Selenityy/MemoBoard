import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// LOGIN
export const loginUser = createAsyncThunk(
  "/user/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed fetch to login user");
      }
      if (data.user) {
        localStorage.setItem("token", data.token);
        return data.user;
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

// SIGN UP
export const signupUser = createAsyncThunk(
  "/user/signup",
  async (formData, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed fetch to signup user");
      }
      if (data.newUser) {
        return data.newUser;
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

// GET ALL USER INFO
export const fetchUserInfo = createAsyncThunk(
  "/user/info",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch("http://localhost:3000/dashboard/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user info");
      }
      if (data.user) {
        return data.user;
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

// GET USER ID
export const fetchUserId = createAsyncThunk("/user/id", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return thunkAPI.rejectWithValue("No token found");
  }
  try {
    const response = await fetch("http://localhost:3000/dashboard/data", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch userId");
    }
    if (data.user._id) {
      return data.user._id;
    } else {
      return thunkAPI.rejectWithValue({
        message: data.message,
        error: data.errors,
      });
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// GET TIMEZONE
export const fetchTimeZone = createAsyncThunk(
  "/user/timezone",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch("http://localhost:3000/dashboard/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch timezone");
      }
      if (data.user.timezone) {
        return data.user.timezone;
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

// UPDATE TIMEZONE
export const updateTimezone = createAsyncThunk(
  "/user/timezone/update",
  async ({ userId, newTimezone }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/${userId}/updateTimezone`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newTimezone }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update timzone");
      }
      if (data.timezone) {
        return data.timezone;
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

// UPDATE ALL USER INFO
export const updateUserInfo = createAsyncThunk(
  "/user/info/update",
  async ({ userId, userInfo }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      // Update full name
      const nameRes = await fetch(
        `http://localhost:3000/dashboard/${userId}/updateName`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );
      const fullNameObj = await nameRes.json();
      if (!nameRes.ok) {
        throw new Error(fullNameObj.message || "Failed to update full name");
      }
      let updatedFirstName;
      let updatedLastName;
      if (fullNameObj.user) {
        updatedFirstName = fullNameObj.user.firstName;
        updatedLastName = fullNameObj.user.lastName;
      } else {
        return thunkAPI.rejectWithValue({
          message: fullNameObj.message,
          error: data.errors,
        });
      }

      // Update email
      const emailRes = await fetch(
        `http://localhost:3000/dashboard/${userId}/updateEmail`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );
      const emailObj = await emailRes.json();
      if (!emailRes.ok) {
        throw new Error(emailObj.message || "Failed to update email");
      }
      let updatedEmail;
      if (emailObj.email) {
        updatedEmail = emailObj.email;
      } else {
        return thunkAPI.rejectWithValue({
          message: emailObj.message,
          error: data.errors,
        });
      }

      // Update username
      const usernameRes = await fetch(
        `http://localhost:3000/dashboard/${userId}/updateUsername`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );
      const usernameObj = await usernameRes.json();
      if (!usernameRes.ok) {
        throw new Error(usernameObj.message || "Failed to update email");
      }
      let updatedUsername;
      if (usernameObj.username) {
        updatedUsername = usernameObj.username;
      } else {
        return thunkAPI.rejectWithValue({
          message: usernameObj.message,
          error: data.errors,
        });
      }

      return {
        updatedFirstName,
        updatedLastName,
        updatedEmail,
        updatedUsername,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// DELETE ACCOUNT
export const deleteAccount = createAsyncThunk(
  "/user/delete",
  async (userId, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/${userId}/account`,
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
        throw new Error(data.message || "Failed to delete account");
      }
      return data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: {
    _id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    googleId: "",
    timezone: "",
  },
  isLoggedIn: false,
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("timezone");
      state.user = initialState.user;
      state.isLoggedIn = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.isLoggedIn = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH USER INFO
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE USER INFO
      .addCase(updateUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH TIMEZONE
      .addCase(fetchTimeZone.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTimeZone.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchTimeZone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE TIMEZONE
      .addCase(updateTimezone.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTimezone.fulfilled, (state, action) => {
        // state.user = { ...state.user, ...action.payload };
        state.user.timezone = action.payload.newTimezone;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateTimezone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH USER ID
      .addCase(fetchUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserId.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // DELETE ACCOUNT
      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.user = initialState.user;
        state.isLoggedIn = false;
        state.status = "succeeded";
        state.error = null;

        localStorage.removeItem("token");
        localStorage.removeItem("timezone");
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
