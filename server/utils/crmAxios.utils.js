import axios from "axios";
import { refreshZohoAccessToken } from "../service/zohoAuth.service.js";

export const crmAxios = (accessToken) => {
  if (!accessToken) {
    throw new Error("Access token is required for Zoho CRM API calls");
  }

  const instance = axios.create({
    baseURL: "https://www.zohoapis.in/crm/v8",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const resp = error.response;
      if (
        resp?.status === 401 &&
        resp?.data?.code === "INVALID_TOKEN"
      ) {
        console.warn("Access token expired. Refreshing...");
        const newToken = await refreshZohoAccessToken();
        error.config.headers["Authorization"] = `Zoho-oauthtoken ${newToken}`;
        return instance.request(error.config);
      }
      // For INVALID_TOKEN or other errors, reject immediately
      return Promise.reject(error);
    }
  );

  return instance;
};
