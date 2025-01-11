import moment from "moment";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Treatment {
  id: number;
  name: string;
  duration: string;
  price: string;
}

interface Metadata {
  slot: string; // "09:00"
  date: number; // Unix timestamp (e.g., 1729018800)
  duration: string; // "30" (in minutes)
}

interface Appointment {
  specialist: string;
  patient: Patient;
  treatment: Treatment;
  metadata: Metadata;
}

const FindAppointment = (
  appointments: Appointment[],
  inputDate: string, // Format: "04-10-2024"
  inputSlot: string // Format: "16:30 - 17:00"
): Appointment | string | false => {
  if (!appointments && !inputDate && !inputSlot) {
    return false;
  }

  // Convert inputDate to a comparable timestamp
  const unixDate = moment(inputDate, "DD-MM-YYYY").startOf("day").unix();
  const [slotStart, slotEnd] = inputSlot.split(" - ");
  const slotStartTime = moment(slotStart, "HH:mm"); // Parse slotStart
  const slotEndTime = moment(slotEnd, "HH:mm"); // Parse slotEnd
  // loop
  const appointment = appointments.find((appt) => {
    if (appt.metadata.date !== unixDate) {
      return false;
    }
    const appointmentStart = moment(appt.metadata.slot, "HH:mm");
    const duration = Number(appt.metadata.duration);
    const appointmentEnd: any = appointmentStart
      .clone()
      .add(duration, "minutes");

    const isWithin =
      slotStartTime.isSameOrAfter(appointmentStart) &&
      slotEndTime.isSameOrBefore(appointmentEnd);
    return appt.metadata.date === unixDate && isWithin;
  });

  if (!appointment) return false; // No appointment on the given date

  const { slot, duration } = appointment.metadata;
  const appointmentStartTime = moment(slot, "HH:mm"); // e.g., "09:00"
  const inputStartTime = moment(slotStart, "HH:mm"); // e.g., "16:30"

  // Check if the slot matches the appointment's start time
  if (appointmentStartTime.isSame(inputStartTime)) {
    return appointment; // Return patient details
  }

  // Check if the slot falls within the appointment duration
  const appointmentEndTime = appointmentStartTime
    .clone()
    .add(+duration, "minutes");

  if (
    inputStartTime.isAfter(appointmentStartTime) &&
    inputStartTime.isBefore(appointmentEndTime)
  ) {
    return "under"; // Slot is within the appointment duration but not the start
  }

  return false; // No matching slot
};

export default FindAppointment;
