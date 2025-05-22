// Corrected purchaseRoutes.js

import express from "express";
import Purchase from "../models/Purchase.js";

const router = express.Router();

// POST /api/purchases/
router.post("/", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json({ message: "Purchase recorded", purchase });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/purchases/
// GET /api/purchases/ with filtering
router.get("/", async (req, res) => {
  try {
    const { base, assetType, startDate, endDate } = req.query;

    const filter = {};

    if (base) filter.base = base;
    if (assetType) filter.assetType = assetType;

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // To include the entire endDate day, set time to 23:59:59.999
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const purchases = await Purchase.find(filter).sort({ date: -1 });

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
