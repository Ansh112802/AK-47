import express from 'express';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';

const router = express.Router();

router.get('/net-movement', async (req, res) => {
  // your route logic here, e.g.:
  try {
    // your aggregation and logic (like in your first snippet)
    res.json({ message: "Net movement data here" });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
