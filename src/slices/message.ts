import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface MessageState {
  message?: string;
}

interface SetMessagePayload {
  message: string;
}

// Initial State
const initialState: MessageState = {};

// Create Slice
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<SetMessagePayload | string>) => {
      // Xử lý cả string và object
      if (typeof action.payload === "string") {
        return { message: action.payload };
      }
      return { message: action.payload.message };
    },
    clearMessage: () => ({ message: "" }),
  },
});

// Export actions và reducer
export const { setMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;

// Export types
export type { MessageState, SetMessagePayload };