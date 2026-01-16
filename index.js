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
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const secretKey = generateSecretKey();
    await sendSecretKey(email, secretKey);

    res.json({ message: "Secret key sent to email" });
  } catch (err) {
    console.error("EMAIL ERROR 👉", err);
    res.status(500).json({ message: "Error sending email via backend" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

