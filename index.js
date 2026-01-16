import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * TEMP STORE (use DB later if needed)
 * email => secretKey
 */
const secretStore = new Map();

/**
 * Generate A7X2-9B3M style key
 */
function generateSecretKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () =>
    Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");

  return `${part()}-${part()}`;
}

/**
 * Email config (GMAIL APP PASSWORD)
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * 1️⃣ Generate & Send Secret Key
 */
app.post("/send-secret", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const secretKey = generateSecretKey();
  secretStore.set(email, secretKey);

  try {
    await transporter.sendMail({
      from: `"Secure Access" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your One-Time Secret Key",
      text: `Your secret access key is:\n\n${secretKey}\n\nThis key can be used only once.`
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed" });
  }
});

/**
 * 2️⃣ Verify Secret Key
 */
app.post("/verify-secret", (req, res) => {
  const { email, key } = req.body;

  const storedKey = secretStore.get(email);

  if (!storedKey) {
    return res.status(400).json({ error: "No key found" });
  }

  if (storedKey !== key) {
    return res.status(401).json({ error: "Invalid key" });
  }

  // ONE-TIME USE
  secretStore.delete(email);

  res.json({ success: true });
});

/**
 * Health check
 */
app.get("/", (_, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
