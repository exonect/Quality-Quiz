import { API } from "./axios";
import {
  LOGOUT_API_URL,
  LOGIN_WITH_SSO_API_URL,
  GET_QUIZ_QUESTION_API_URL,
  POST_QUIZ_ANSWER_API_URL,
  GET_DEPARTMENTS_API_URL,
  GET_TOP_50_USERS_API_URL,
  GET_TOP_15_USERS_API_URL,
  GET_TOP_3_USERS_API_URL,
  EXPORT_TOP_50_USERS_API_URL,
  EXPORT_ALL_USERS_API_URL,
  POST_USER_DEPARTMENT_API_URL,
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
    return { ...response.data, status: response.data.status };
  } catch (error) {
    console.log("Login With SSO Api error ======>>>", error);
    return error?.response;
  }
};

export const GetQuizQuestionApi = async (params) => {
  try {
    const response = await API.get(`${GET_QUIZ_QUESTION_API_URL}round-one/random/get/`, params);
    console.log("Get Quiz Question Api Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Get Quiz Question Api Api error ======>>>", error);
    return error?.response;
  }
};

export const PostQuizAnswerApi = async (params) => {
  try {
    const response = await API.post(`${POST_QUIZ_ANSWER_API_URL}round-one/post/`, params);
    console.log("Post Quiz Answer Api Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Post Quiz Answer Api Api error ======>>>", error);
    return error?.response;
  }
};

export const GetDepartmentsApi = async (params) => {
  try {
    const response = await API.get(GET_DEPARTMENTS_API_URL, params);
    console.log("Get Departments Api Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Get Departments Api Api error ======>>>", error);
    return error?.response;
  }
};

export const GetTop50UsersApi = async (params) => {
  try {
    const response = await API.get(GET_TOP_50_USERS_API_URL, params);
    console.log("Get Top 50 Users Api Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Get Top 50 Users Api Api error ======>>>", error);
    return error?.response;
  }
};

export const GetTop15UsersApi = async (params) => {
  try {
    const response = await API.get(GET_TOP_15_USERS_API_URL, params);
    console.log("Get Top 15 Users Api Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Get Top 15 Users Api Api error ======>>>", error);
    return error?.response;
  }
};

export const GetTop3UsersApi = async (params) => {
  try {
    const response = await API.get(GET_TOP_3_USERS_API_URL, params);
    console.log("Get Top 3 Users Api Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Get Top 3 Users Api Api error ======>>>", error);
    return error?.response;
  }
};

export const ExportTop50UsersDataApi = async (params) => {
  try {
    const response = await API.post(EXPORT_TOP_50_USERS_API_URL, params, {
      responseType: "blob",
    });
    const contentDisposition = response.headers['content-disposition'];

    const filename = contentDisposition
      ? contentDisposition
        .split("filename=")[1]
        .split(";")[0]
        .trim()
        .replace(/['"]/g, "")
      : "download.xlsx";

    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    console.log("Export Top 50 Users Data Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Export Top 50 Users Data Api error ======>>>", error);
    return error?.response;
  }
};


export const ExportAllUsersDataApi = async (params) => {
  try {
    const response = await API.post(`${EXPORT_ALL_USERS_API_URL}-${params.roundNumber}-responses/`, params, {
      responseType: "blob",
    });
    const contentDisposition = response.headers['content-disposition'];

    const filename = contentDisposition
      ? contentDisposition
        .split("filename=")[1]
        .split(";")[0]
        .trim()
        .replace(/['"]/g, "")
      : "download.xlsx";

    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    console.log("Export All Users Data Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Export All Users Data Api error ======>>>", error);
    return error?.response;
  }
};

export const PostUserDepartmentApi = async (params) => {
  try {
    const response = await API.post(`${POST_USER_DEPARTMENT_API_URL}`, params);
    console.log("Post User Department Api Api response ======>>>", response);
    return response;
  } catch (error) {
    console.log("Post User Department Api Api error ======>>>", error);
    return error?.response;
  }
};