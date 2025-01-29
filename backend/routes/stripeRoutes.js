import express from 'express';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize with secret key from env

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { festivalId, quantity } = req.body;

    // Fetch ticket details from the database (assuming you have a Ticket model)
    const ticket = await Ticket.findById(festivalId);
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Ticket for ${ticket.name}`,  // Festival name or ticket name
            },
            unit_amount: ticket.price * 100,  // Price in cents
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
