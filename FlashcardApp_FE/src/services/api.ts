import axios from "axios";

const api = axios.create({
  // baseURL: "http://54.208.12.109:9090/api/v1",
  baseURL: "https://api.dhadev.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // handle token expiration
    if (error.response && error.response.status === 401 && !error.config._retry) {
      error.config._retry = true; // prevent infinite loop
      try {
        const refreshResponse = await api.post("/auth/refresh");
        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken); // update accessToken in local storage

        // update headers with new accessToken
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(error.config); // retry the original request
      } catch (refreshError) {
        window.location.href = "/auth/login"; // redirect to login if refresh fails
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
