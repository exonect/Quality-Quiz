import axios from "axios";
import { BASE_URL, LOGIN_WITH_SSO_API_URL } from "./apiURL";
import { signOut } from "./";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(async (config) => {
  const accessToken = await JSON.parse(localStorage.getItem("accessToken"));
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status !== 401) {
      throw error;
    } else {
      if (error.response.request.responseURL.includes(LOGIN_WITH_SSO_API_URL)) {
        throw error;
      } else {
        signOut();
        throw error;
      }
    }
  }
);
export { API };
