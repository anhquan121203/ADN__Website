import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Feartures/user/authSlice";
import adminSlice from "../Feartures/admin/adminSlice";
import serviceSlice from "../Feartures/services/serviceSlice";
import slotSlice from "../Feartures/slots/slotSlice";
import departmentSlice from "../Feartures/department/departmentSlice";
import staffSlice from "../Feartures/staff/staffSlice";
import staffProfileSlice from "../Feartures/staffProfile/staffProfileSlice";
import kitSlice from "../Feartures/kits/kitSlice";
import appointmentSlice from "../Feartures/appoinment/appoimentSlice";
import sampleSlice from "../Feartures/sample/sampleSlice";
import paymentSlice from "../Feartures/payment/paymentSlice";
import caseSlice from "../Feartures/case/caseSlice";
import resultSlice from "../Feartures/result/resultSlice";
import dashboardSlice from "../Feartures/dashboard/dashboardSlice";

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
    kit: kitSlice.reducer,
    appointment: appointmentSlice.reducer,
    sample: sampleSlice.reducer,
    payment: paymentSlice.reducer,
    case: caseSlice.reducer,
    result: resultSlice.reducer,
    dashboard: dashboardSlice.reducer, 
    
  },
});
