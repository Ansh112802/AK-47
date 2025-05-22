// Transfer.js
import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  fromBase: { type: String, required: true },
  toBase: { type: String, required: true },
  assetType: { type: String, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Transfer = mongoose.model("Transfer", transferSchema);
export default Transfer;
