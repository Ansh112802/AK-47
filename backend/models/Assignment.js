import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  personnelId: { type: String, required: true },
  assetType: { type: String, required: true },
  assignedQuantity: { type: Number, default: 0 },
  expendedQuantity: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
