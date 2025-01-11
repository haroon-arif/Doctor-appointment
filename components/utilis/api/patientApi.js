import api from "./api";

export const getPatientsApi = async () => {
  try {
    let response = await api.get("patient");
    console.log("Patients API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Patients API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const createPatientsApi = async (data) => {
  try {
    let response = await api.post("patient", data, {
      headers: {
        "content-type": "multipart/formdata",
        accept: "application/json",
      },
    });

    console.log("Patients API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Patients API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};
