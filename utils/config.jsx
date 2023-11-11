import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://capstone-backend-expressjs.vercel.app/",
  // withCredentials: true,
});
