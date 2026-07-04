const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    if (!email) {
      console.error("Email is undefined or empty");
      console.log("Called with:", { email, subject, message });
      throw new Error("Email recipient is required");
    }

    if (!subject) {
      console.warn("Subject is missing, using default");
      subject = "Notification from ShopNest";
    }

    if (!message) {
      console.warn("Message is missing, using default");
      message = "<p>No message content provided.</p>";
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ShopNest Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `Failed to send email to ${email || "undefined"}:`,
      error.message,
    );
    console.error("Full error:", error);
    throw error;
  }
};

module.exports = sendEmail;
