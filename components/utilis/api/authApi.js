import api from "./api";

export const userSignin = async (data) => {
  try {
    let response = await api.post("signin", data);
    console.log("Signin API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Signin API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const updatePasswordApi = async (data) => {
  try {
    let response = await api.post("signin/update-password", data);
    console.log("Update password API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Update password API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};
