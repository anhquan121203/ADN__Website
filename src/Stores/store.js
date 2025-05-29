import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Feartures/user/authSlice";
import adminSlice from "../Feartures/admin/adminSlice";
import serviceSlice from "../Feartures/services/serviceSlice";
import slotSlice from "../Feartures/slots/slotSlice";
import departmentSlice from "../Feartures/department/departmentSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice.reducer,
        account: adminSlice.reducer,
        service: serviceSlice.reducer,
        slot: slotSlice.reducer,
        department: departmentSlice.reducer,
    },
    
})