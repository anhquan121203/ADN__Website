import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Feartures/user/authSlice";
import adminSlice from "../Feartures/admin/adminSlice";
import serviceSlice from "../Feartures/services/seviceSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice.reducer,
        account: adminSlice.reducer,
        service: serviceSlice.reducer,
    },
    
})