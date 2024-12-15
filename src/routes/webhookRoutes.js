import express from 'express';
const router = express.Router();

import {
  verifyToken,
  receiveMessage,
} from '../controllers/whatsapp.controller.js';

router.get('/', verifyToken).post('/', receiveMessage);

export default router;
