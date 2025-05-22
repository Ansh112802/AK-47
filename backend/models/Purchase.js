import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  base: { type: String, required: true },       // Add this line

  assetType: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now }, // important!
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
