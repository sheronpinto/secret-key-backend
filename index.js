import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sendSecretKey } from "./emailService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// 🧠 Temporary in-memory store
// ===============================
const verificationStore = new Map();
/*
  paymentId => {
    email,
    secretKey,
    expiresAt
  }
*/

// ===============================
// 🔐 Secret Key Generator
// ===============================
function generateSecretKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let key = "";
  for (let i = 0; i < 8; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key.slice(0, 4) + "-" + key.slice(4);
}

// ===============================
// 🟢 Health Check
// ===============================
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ===============================
// ✉️ Send Secret Key
// ===============================
app.post("/send-key", async (req, res) => {
  try {
    const { email, paymentId } = req.body;

    if (!email || !paymentId) {
      return res.status(400).json({
        success: false,
        message: "Email and Payment ID are required"
      });
    }

    const secretKey = generateSecretKey();

    // ✅ Store key temporarily
    verificationStore.set(paymentId, {
      email,
      secretKey,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // ✅ Send email
    await sendSecretKey(email, secretKey);

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error("SEND-KEY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email"
    });
  }
});

// ===============================
// 🔑 Verify Secret Key
// ===============================
app.post("/verify-key", (req, res) => {
  const { paymentId, enteredKey } = req.body;

  if (!paymentId || !enteredKey) {
    return res.status(400).json({
      success: false,
      message: "Missing data"
    });
  }

  const record = verificationStore.get(paymentId);

  if (!record) {
    return res.status(400).json({
      success: false,
      message: "No verification request found"
    });
  }

  if (Date.now() > record.expiresAt) {
    verificationStore.delete(paymentId);
    return res.status(400).json({
      success: false,
      message: "Key expired"
    });
  }

  if (record.secretKey !== enteredKey) {
    return res.status(400).json({
      success: false,
      message: "Invalid Secret Key"
    });
  }

  // ✅ Success → remove key
  verificationStore.delete(paymentId);

  return res.json({
    success: true
  });
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



