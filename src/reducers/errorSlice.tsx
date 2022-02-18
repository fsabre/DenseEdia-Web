import { createSlice } from "@reduxjs/toolkit";


interface IError {
  id: number;
  text: string;
}

export const errorSlice = createSlice({
  name: 'error',
  initialState: {
    nextId: 1,
    errors: [] as IError[],
  },
  reducers: {
    // Create a new error
    pushError: (state, action) => {
      const error: IError = {
        id: state.nextId,
        text: action.payload.text,
      };
      state.nextId = state.nextId + 1;
      state.errors.push(error);
    },
    // Pop an error by its ID
    pop: (state, action) => {
      const idToRemove: number = action.payload;
      state.errors = state.errors.filter(err => err.id !== idToRemove);
    },
  },
});
