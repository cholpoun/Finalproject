import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch("https://api.customer.io/v1/send/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.CUSTOMER_IO_API_KEY}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        to,
        from: process.env.EMAIL_FROM,
        subject,
        html,
      }),
    });

    const data = await response.json();
    console.log("📧 Email Sent via Customer.io:", data);
  } catch (error) {
    console.error("❌ Error Sending Email:", error.message);
  }
};
