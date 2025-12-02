import { crmAxios } from "../utils/crmAxios.utils.js";


export const getProduct = async (access_token, instamartProductName) => {
  try {
    const api = crmAxios(access_token);

    const result = await api.get("/settings/fields?module=Products");
    
    if (!result || !result.data || !result.data.fields) {
      throw new Error("Invalid response from Zoho CRM");
    }

    const fields = result.data.fields;
    
    let fieldApiName = "";
    for (const field of fields) {
      if (field.field_label === "Indiamart product name") {
        fieldApiName = field.api_name;
      }
    }

    if (!fieldApiName) {
      throw new Error("Indiamart Product Name field not found in Zoho CRM");
    }
    
    const query = {
      select_query: `select ${fieldApiName} from Products where (${fieldApiName} = '${instamartProductName}')`,
    };
    const response = await api.post("/coql", query);
    if (!response || !response.data || !response.data.data || response.data.data.length === 0) {
      throw new Error("Product not found in Zoho CRM");
    }
    return response.data.data[0];
  } catch (error) {

    console.error(
      "Error fetching product:",
      error?.response?.data || error.message
    );

    throw new Error("Failed to fetch product from Zoho CRM");
  
  }
};

export const getLeadsRelatedList = async (access_token) => {
  try {
    const api = crmAxios(access_token);

    const response = await api.get("/settings/related_lists?module=Leads");

    if (!response && !response.data && !response.data.related_lists) {
      throw new Error("Invalid response from Zoho CRM");
    }

    const relatedLists = response.data.related_lists;

    for (let i = 0; i < relatedLists.length; i++) {
      if (relatedLists[i].display_label === "Products") {

        return relatedLists[i]
      }
    }

    return null;
  } catch (error) {
    console.error(
      "Error fetching related lists:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to fetch related Lists from Zoho CRM");
  }
};