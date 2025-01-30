import axios from "axios";

const API_URL = "http://https://finalproject-jan30.onrender.com"; // Update this for production

// Set up Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to purchase a ticket
export const purchaseTicket = async (festivalId, quantity, paymentMethod, token) => {
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
    console.error("Ticket purchase failed:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to fetch user tickets (Fixed API route)
export const getUserTickets = async (token) => {
  try {
    const response = await axiosInstance.get("/tickets/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user tickets:", error.response?.data || error.message);
    throw error;
  }
};
