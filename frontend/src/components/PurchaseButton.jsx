import { purchaseTickets } from "../api/tickets";

const PurchaseButton = ({ userId, festivalId, quantity }) => {
  const handlePurchase = async () => {
    try {
      const data = await purchaseTickets(userId, festivalId, quantity);
      console.log("Biljettköp lyckades!", data);
    } catch (error) {
      console.error("Fel vid biljettköp:", error);
    }
  };

  return <button onClick={handlePurchase}>Köp biljetter</button>;
};

export default PurchaseButton;
