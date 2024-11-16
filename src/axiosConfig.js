import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", 
  timeout: 5000, 
  headers: {
    "Content-Type": "application/json", 
    Accept: "application/json",         
  },
});

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    console.error("Erreur Axios :", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
