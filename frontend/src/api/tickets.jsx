export const purchaseTickets = async (userId, festivalId, quantity) => {
  try {
    const response = await fetch("/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, festivalId, quantity }),
    });

    const data = await response.json();
    return response.ok ? data : Promise.reject(data);
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    throw error;
  }
};
