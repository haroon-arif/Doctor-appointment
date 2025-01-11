import api from "./api";

export const getAppointmentsApi = async () => {
  try {
    let response = await api.get("appointment");
    // console.log("Appointment API response", response.data);
    return response.data;
  } catch (error) {
    console.log("Appointment API error", error);
    console.log("error.message: ", error.message);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};

export const createAppointmentApi = async (data) => {
  try {
    let response = await api.post("appointment", data);
    console.log("Appointment API response", response.data);

    return response.data;
  } catch (error) {
    console.log("Appointment API error", error);

    throw new Error(
      error?.response?.data || "Something went wrong, please try again"
    );
  }
};
