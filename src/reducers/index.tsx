import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { errorSlice } from "./errorSlice";


const rootReducer = combineReducers({
  error: errorSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
