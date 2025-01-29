import express from 'express';
import Stripe from 'stripe';
import Festival from '../models/Festivals.js';  // Correct file name and path

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize with secret key from env
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { festivalId, quantity } = req.body;

    // Fetch festival details from the festivals collection
    const festival = await Festival.findById(festivalId);
    if (!festival) {
      return res.status(404).send('Festival not found');
    }

    // Calculate total price (this assumes that the festival price is per ticket)
    const totalPrice = festival.ticketPrice * quantity;

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Ticket for ${festival.name}`,  // Festival name
            },
            unit_amount: festival.ticketPrice * 100,  // Price in cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success?festivalId=${festivalId}`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).send('Server error');
  }
});

export default router;
