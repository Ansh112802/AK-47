import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

router.post("/assignments", async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).json({ message: "Assignment recorded", inventory });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const inventoryRecords = await Inventory.find();
    res.json(inventoryRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
