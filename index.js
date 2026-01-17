import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sendSecretKey } from "./emailService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
// ✉️ Send Secret Key Route
// ===============================
app.post("/send-key", async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validate input FIRST
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    // ✅ Generate key
    const secretKey = generateSecretKey();

    // 🔥 MUST await email sending
    await sendSecretKey(email, secretKey);

    // ✅ Explicit success response for frontend
    return res.status(200).json({
      success: true
    });

  } catch (err) {
    console.error("SEND KEY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send email"
    });
  }
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
