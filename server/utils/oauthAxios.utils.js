import axios from "axios";

export const oauthAxios = axios.create({
  baseURL: "https://accounts.zoho.in/oauth/v2"
});