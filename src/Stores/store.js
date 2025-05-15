import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Feartures/user/authSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice.reducer,
    },
    
})