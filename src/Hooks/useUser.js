import { useDispatch, useSelector } from "react-redux";
import { updateUser, changePassword as changePasswordAction, forgotPassword } from "../Feartures/staff/staffSlice";

const useUser = () => {
    const dispatch = useDispatch();
    const { accounts, loading, error, total } = useSelector((state) => state.account);

    const updateUsers = async (user) => {
        try {
            const response = await dispatch(updateUser(user))
            return { success: true, data: response };
        } catch (error) {
            return error
        }
    }
    
    const changeUserPassword = async (passwordData) => {
        try {
            const response = await dispatch(changePasswordAction(passwordData))
            return { success: true, data: response };
        } catch (error) {
            return error
        }
    }

    const forgotPasswords = async (email) => {
        try {
            const response = await dispatch(forgotPassword(email))
            return { success: true, data: response};
        } catch (error) {
            return error
        }
    }
    return { accounts, loading, error, total, updateUsers, changeUserPassword, forgotPasswords };
};
export default useUser;