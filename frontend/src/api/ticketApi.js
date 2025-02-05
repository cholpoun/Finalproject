import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFestivalDetails = async (festivalId) => {
  try {
    const response = await axiosInstance.get(`/festivals/${festivalId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch festival details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const purchaseTicket = async (
  festivalId,
  quantity,
  paymentMethod,
  token
) => {
  try {
    const response = await axiosInstance.post(
      `/tickets/${festivalId}`,
      { quantity, paymentMethod },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Ticket purchase failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserTickets = async (token) => {
  try {
    const response = await axiosInstance.get("/tickets/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch user tickets:",
      error.response?.data || error.message
    );
    throw error;
  }
};
