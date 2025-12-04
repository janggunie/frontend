import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청/응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 에러:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);
