const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendSecretKey(toEmail, secretKey) {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: "Movaro",
          email: "no-reply@movaro.com" // must be verified in Brevo
        },
        to: [{ email: toEmail }],
        subject: "Your Secret Access Key",
        textContent: `Your secret access key is: ${secretKey}`
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("BREVO API ERROR:", err);
      throw new Error("Brevo API failed");
    }

  } catch (error) {
    console.error("EMAIL SEND FAILED:", error);
    throw error;
  }
}



