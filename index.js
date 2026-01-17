import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sendSecretKey } from "./emailService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function generateSecretKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let key = "";
  for (let i = 0; i < 8; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key.slice(0, 4) + "-" + key.slice(4);
}

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/send-key", async (req, res) => {
  const { email } = req.body;

  try {
    const secretKey = generateSecretKey(); // or however you create it
    await sendSecretKey(email, secretKey);

    // 🔥 THIS LINE IS THE FIX
    return res.status(200).json({
      success: true,
      message: "Secret key sent to email"
    });

  } catch (err) {
    console.error("SEND KEY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send email"
    });
  }
});

