import axios from "axios";

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

  return instance;
};
