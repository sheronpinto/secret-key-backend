import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  paymentId: String,
  name: String,
  email: String,
  price: Number,

  // ✅ ADD THESE
  pdfId: String,
  pdfName: String,
  downloadUrl: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", OrderSchema);