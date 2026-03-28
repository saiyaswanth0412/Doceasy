import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") || ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [virtualConsults, setVirtualConsults] = useState([]);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${dToken}`,
    },
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        authHeader
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        authHeader
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        authHeader
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/dashboard",
        authHeader
      );

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/profile",
        authHeader
      );

      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getVirtualConsults = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/doctor/virtual-consults',
        authHeader
      );

      if (data.success) {
        setVirtualConsults(data.consults);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const sendVirtualConsultReply = async (consultId, doctorReply) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/virtual-consult-reply',
        { consultId, doctorReply },
        authHeader
      );

      if (data.success) {
        toast.success(data.message);
        getVirtualConsults();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const addVirtualConsultPrescription = async (consultId, medicines, notes) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/add-virtual-consult-prescription',
        { consultId, medicines, notes },
        authHeader
      );

      if (data.success) {
        toast.success(data.message);
        getVirtualConsults();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      return false;
    }
  };

  const getConsultSummary = async (consultId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/get-consult-summary',
        { consultId },
        authHeader
      );

      if (data.success) {
        return {
          success: true,
          summary: data.summary,
        };
      } else {
        toast.error(data.message);
        return {
          success: false,
          error: data.message,
        };
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate summary');
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    getAppointments,
    appointments,
    setAppointments,
    completeAppointment,
    cancelAppointment,
    getDashData,
    dashData,
    setDashData,
    getProfileData,
    setProfileData,
    profileData,
    getVirtualConsults,
    virtualConsults,
    sendVirtualConsultReply,
    addVirtualConsultPrescription,
    getConsultSummary,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
