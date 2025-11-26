import { crmAxios } from "../utils/crmAxios.utils";

export const createLead = async (access_token, payload) => {
  try {
    if (!access_token) {
      throw new Error("Access token is required to create lead");
    }
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error("Payload is required to create lead");
    }
    const response = await crmAxios(access_token).post("/Leads", {
      data: [payload],
    });
    return response;
  } catch (error) {
    console.error("Error creating lead in Zoho CRM:", error);
    throw error;
  }
};
