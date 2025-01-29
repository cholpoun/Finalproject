import { useState } from 'react';
import PropTypes from 'prop-types';  
import axios from 'axios';

const TicketPurchaseButton = ({ festivalId }) => {
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const response = await axios.post(`https://finalproject-vol6.onrender.com/tickets/${festivalId}`);
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
    <button onClick={handlePurchase} disabled={purchasing}>
      {purchasing ? 'Purchasing...' : 'Purchase Ticket'}
    </button>
  );
};

TicketPurchaseButton.propTypes = {
  festivalId: PropTypes.string.isRequired,  
};

export default TicketPurchaseButton;
