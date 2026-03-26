import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSessionAPI, refreshToken } from "../API/AuthAPI";
import { updateUserDetails } from "../Store/userSlice";
import { RootState } from "../Store/store";

const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User.userID);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (user) {
                    setLoading(false);
                    return;
                }

                const data = await getSessionAPI();
                if (data.user) {
                    dispatch(updateUserDetails(data));
                }
            } catch (error) {
                console.error('Session fetch failed, attempting refresh...', error);
                try {
                    await refreshToken();
                    const response = await getSessionAPI();
                    console.log(response, "UseAuthResponse");
                    if (response.user) {
                        dispatch(updateUserDetails(response));
                    }
                } catch (refreshError) {
                    console.error('Refresh token also failed', refreshError);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [dispatch, user]);

    return { loading, isAuthenticated: !!user };
};

export default useAuth;
