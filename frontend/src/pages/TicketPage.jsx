import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TicketPage = () => {
  const { festivalId } = useParams();  
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const response = await axios.post(`https://finalproject-vol6.onrender.com/tickets/${festivalId}`, { quantity });
      console.log(response.data); 
      alert('Ticket purchased successfully!');
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Ticket purchase failed!');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <>
    <div>
      <h1>Purchase Tickets for Festival {festivalId}</h1>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
        max="10"
      />
      <button onClick={handlePurchase} disabled={purchasing}>
        {purchasing ? 'Purchasing...' : 'Purchase Ticket'}
      </button>
    </div>
      </>
  );
};

export default TicketPage;
