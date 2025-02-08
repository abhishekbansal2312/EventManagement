import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../redux/slices/userSlice";
import useAxios from "./useAxios";

const useUserSession = () => {
  const dispatch = useDispatch();
  const makeRequest = useAxios();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await makeRequest(
          "http://localhost:4600/api/auth/me",
          "GET",
          null,
          true
        );

        if (response) {
          dispatch(loginUser(response));
        } else {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        dispatch(logoutUser());
      }
    };

    checkUserSession();
  }, []);

  return null;
};

export default useUserSession;
