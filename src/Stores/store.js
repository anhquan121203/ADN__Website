import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Feartures/user/authSlice";
import adminSlice from "../Feartures/admin/adminSlice";
import serviceSlice from "../Feartures/services/serviceSlice";
import slotSlice from "../Feartures/slots/slotSlice";
import departmentSlice from "../Feartures/department/departmentSlice";
import staffSlice from "../Feartures/staff/staffSlice";
import staffProfileSlice from "../Feartures/staffProfile/staffProfileSlice";

export const store = configureStore({
    reducer: {
        // Add your reducers here
        auth: authSlice.reducer,
        account: adminSlice.reducer,
        service: serviceSlice.reducer,
        slot: slotSlice.reducer,
        department: departmentSlice.reducer,
        staff: staffSlice.reducer,
        staffProfile: staffProfileSlice.reducer,
    },
    
})