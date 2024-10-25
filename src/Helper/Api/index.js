import { API } from "./axios";
import {
  LOGOUT_API_URL,
  LOGIN_WITH_SSO_API_URL,
  GET_QUIZ_QUESTION_API_URL,
} from "./apiURL";

export const signOut = async () => {
  localStorage.clear();
  window.location.reload();
};

export const LogoutApi = async (params) => {
  try {
    const response = await API.post(`${LOGOUT_API_URL}`, params);
    console.log("Logout Api response ======>>>", response);
    signOut()
    return { ...response.data, status: response.status };
  } catch (error) {
    console.log("Logout Api error ======>>>", error);
    return error?.response;
  }
};

export const LoginWithSSOApi = async (params) => {
  try {
    const response = await API.post(`${LOGIN_WITH_SSO_API_URL}`, params);
    console.log("Login With SSO Api response ======>>>", response);
    return { ...response.data, status: response.status };
  } catch (error) {
    console.log("Login With SSO Api error ======>>>", error);
    return error?.response;
  }
};

export const GetQuizQuestionApi = async (params) => {
  try {
    const response = await API.get(`${GET_QUIZ_QUESTION_API_URL}round-one/random/get/`, params);
    console.log("Get Quiz QuestionApi Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Get Quiz QuestionApi Api error ======>>>", error);
    return error?.response;
  }
};
