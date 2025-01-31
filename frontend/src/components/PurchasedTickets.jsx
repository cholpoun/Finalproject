import { useEffect, useState } from "react";

export default function PurchasedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/me/tickets", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tickets.");
        }

        const data = await response.json();
        setTickets(data.tickets);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>My Purchased Tickets</h2>
      {tickets.length > 0 ? (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.festivalId._id}>
              <p><strong>Festival:</strong> {ticket.festivalId.name}</p>
              <p><strong>Quantity:</strong> {ticket.quantity}</p>
              <p><strong>Purchase Date:</strong> {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not purchased any tickets yet.</p>
      )}
    </div>
  );
}
