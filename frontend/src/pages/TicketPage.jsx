// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe("your-publishable-key-here"); // Your Stripe publishable key

// const TicketPage = () => {
//   const { festivalId } = useParams();  
//   const [quantity, setQuantity] = useState(1);
//   const [purchasing, setPurchasing] = useState(false);

//   const handlePurchase = async () => {
//     setPurchasing(true);
//     try {
//       // Call your backend to create the Stripe Checkout session
//       const response = await axios.post('https://finalproject-vol6.onrender.com/api/stripe/create-checkout-session', { 
//         festivalId, 
//         quantity 
//       });

//       // Get the session ID from the backend response
//       const { id } = response.data;

//       // Redirect to Stripe Checkout
//       const stripe = await stripePromise;
//       const { error } = await stripe.redirectToCheckout({ sessionId: id });

//       if (error) {
//         console.error('Error during checkout:', error);
//         alert('There was an issue redirecting to checkout.');
//       }
//     } catch (error) {
//       console.error('Error creating checkout session:', error);
//       alert('Ticket purchase failed!');
//     } finally {
//       setPurchasing(false);
//     }
//   };

//   return (
//     <>
//       <div>
//         <h1>Purchase Tickets for Festival {festivalId}</h1>
//         <input
//           type="number"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//           min="1"
//           max="10"
//         />
//         <button onClick={handlePurchase} disabled={purchasing}>
//           {purchasing ? 'Purchasing...' : 'Purchase Ticket'}
//         </button>
//       </div>
//     </>
//   );
// };

// export default TicketPage;
