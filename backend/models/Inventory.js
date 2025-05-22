import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  personnelId: { type: String, required: true },
  assetType: { type: String, required: true },
  assignedQuantity: { type: Number, required: true },
  expendedQuantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
