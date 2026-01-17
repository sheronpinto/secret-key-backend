import fetch from "node-fetch";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendSecretKey(toEmail, secretKey) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: "Movaro",
        email: "no-reply@movaro.com" // use verified sender
      },
      to: [
        {
          email: toEmail
        }
      ],
      subject: "Your Secret Access Key",
      textContent: `Your secret access key is: ${secretKey}`
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("BREVO API ERROR:", error);
    throw new Error("Failed to send email via Brevo API");
  }
}


