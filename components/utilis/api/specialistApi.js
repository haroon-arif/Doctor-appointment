import api from "./api";

export const getSpecialistAPI = async () => {
  try {
    let id = JSON.parse(localStorage.getItem("session")).user.id;
    let response = await api.get(`specialist?specialistId=${id}`);
    console.log("Specialist get API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Specialist get API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const specialistScheduleAPI = async (data) => {
  try {
    let response = await api.post("specialist/schedule", data);
    console.log("Schedule API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Schedule API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const updateServicesAPI = async (data) => {
  try {
    let response = await api.post("specialist/services", data);
    console.log("Services API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Services API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const bookedSlotsAPI = async (data) => {
  try {
    let response = await api.post("specialist/booked-slots", data);
    console.log("Specialist booked slots API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Specialist booked slots API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const updateSpecialistAPI = async (data) => {
  try {
    let response = await api.put("specialist", data, {
      headers: {
        "content-type": "multipart-formdata",
        accept: "application/json",
      },
    });

    console.log("Specialist update API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Specialist update API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};
