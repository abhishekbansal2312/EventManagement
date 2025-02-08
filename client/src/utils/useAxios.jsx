import axios from "axios";

export default function useAxios() {
  const makeRequest = async (
    url,
    method = "GET",
    data = null,
    authRequired = false
  ) => {
    try {
      const config = {
        url,
        method,
        data,
        withCredentials: authRequired,
        headers: {},
      };

      if (authRequired) {
        const authtoken = localStorage.getItem("authtoken");
        if (authtoken) {
          config.headers.Authorization = `Bearer ${authtoken}`;
        }
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Network Error:", error.message);
      }
      throw error;
    }
  };

  return makeRequest;
}
