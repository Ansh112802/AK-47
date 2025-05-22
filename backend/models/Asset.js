import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  assetType: { type: String, required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Asset = mongoose.model("Asset", assetSchema);
export default Asset;
