import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendSecretKey(toEmail, secretKey) {
  await transporter.sendMail({
    from: `"Secret Key App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Secret Access Key",
    text: `Your secret access key is: ${secretKey}`
  });
}
