import nodemailer from "nodemailer";
console.log("BREVO KEY PRESENT:", !!process.env.BREVO_SMTP_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.BREVO_SMTP_KEY
  }
});

export async function sendSecretKey(toEmail, secretKey) {
  await transporter.sendMail({
    from: "LuminaBox <no-reply@luminabox.com>",
    to: toEmail,
    subject: "Your Secret Access Key",
    text: `Your secret access key is: ${secretKey}`
  });
}


