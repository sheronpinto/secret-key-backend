import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true },
  pdfId: { type: String },
  pdfName: { type: String },
  price: { type: Number },
  downloadUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
