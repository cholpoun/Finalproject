// routes/ticketRoutes.js
import express from 'express';
import { purchaseTicket } from '../controllers/ticketController.js';

const router = express.Router();

// POST-rutt för biljettköp
router.post('/purchase', purchaseTicket);

export default router;
