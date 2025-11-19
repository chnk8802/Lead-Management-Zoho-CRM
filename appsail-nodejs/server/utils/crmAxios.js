// utils/zohoAxios.js
import axios from "axios";
import { refreshZohoAccessToken } from "../service/zohoAuth.service.js";

// Create a Zoho CRM axios instance
export const crmAxios = (accessToken) => {
  if (!accessToken) {
    throw new Error("Access token is required for Zoho CRM API calls");
  }

  const instance = axios.create({
    baseURL: "https://www.zohoapis.in/crm/v8",
    headers: {
      "Authorization": `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  // Optional: add interceptors for logging or refresh token handling
  instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Access token expired. Refreshing...");
      await refreshZohoAccessToken();
      return instance.request(error.config);
    }
    return Promise.reject(error);
  }
);


  return instance;
};
