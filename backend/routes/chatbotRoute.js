import express from 'express';
import { sendMessage } from '../controllers/chatbotController.js';

const router = express.Router();

// Route to send message to chatbot (public endpoint)
router.post('/send-message', sendMessage);

export default router;
