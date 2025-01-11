import api from "./api";

export const getCategories = async () => {
  try {
    let response = await api.get("treatment/category");
    console.log("Schedule API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Schedule API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const getSubcategories = async () => {
  try {
    let response = await api.get("treatment/subcategory");
    console.log("Schedule API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Schedule API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};
