// transferRoutes.js
import express from "express";
import Transfer from "../models/Transfer.js";

const router = express.Router();
// POST: Record a new transfer
router.post("/", async (req, res) => {
  try {
    const { fromBase, toBase, assetType, quantity } = req.body;

    const newTransfer = new Transfer({
      fromBase,
      toBase,
      assetType,
      quantity,
      date: new Date(), // Always save the current date
    });

    const savedTransfer = await newTransfer.save();
    res.status(201).json(savedTransfer);
  } catch (error) {
    console.error("❌ Error saving transfer:", error);
    res.status(500).json({ error: "Failed to save transfer" });
  }
});

// GET: Fetch transfers with optional filters
router.get("/", async (req, res) => {
  try {
    const { date, assetType } = req.query;
    const filter = {};

    // Asset type filter
    if (assetType) {
      filter.assetType = assetType;
    }

    // Date filter (get transfers on the same day)
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const transfers = await Transfer.find(filter).sort({ date: -1 });
    res.json(transfers);
  } catch (error) {
    console.error("❌ Error fetching transfers:", error);
    res.status(500).json({ error: "Failed to fetch transfers" });
  }
});

export default router;
