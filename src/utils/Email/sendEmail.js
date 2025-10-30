import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { envVariables } from "../../config/envVariables.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTransporter = () => {
  return nodemailer.createTransport({
    host: envVariables.SMTP_HOST,
    port: envVariables.SMTP_PORT,
    secure: true,
    auth: {
      user: envVariables.SMTP_USER,
      pass: envVariables.SMTP_PASS,
    },
  });
};

export const sendOTPEmail = async (recipientEmail, recipientName, otp) => {
  try {
    const transporter = createTransporter();

    const html = await ejs.renderFile(
      path.join(__dirname, "templates", "otp.ejs"),
      {
        name: recipientName,
        otp: otp,
        year: new Date().getFullYear(),
      }
    );

    const mailOptions = {
      from: `"BNP - Bangladesh Nationalist Party" <${envVariables.SMTP_USER}>`,
      to: recipientEmail,
      subject: "Your OTP for BNP Account Verification",
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

// Send Forgot Password Email
export const sendForgotPasswordEmail = async (
  recipientEmail,
  recipientName,
  resetLink
) => {
  try {
    const transporter = createTransporter();

    const html = await ejs.renderFile(
      path.join(__dirname, "templates", "forgotpassword.ejs"),
      {
        name: recipientName,
        resetLink: resetLink,
        year: new Date().getFullYear(),
      }
    );

    const mailOptions = {
      from: `"BNP - Bangladesh Nationalist Party" <${envVariables.SMTP_USER}>`,
      to: recipientEmail,
      subject: "Reset Your BNP Account Password",
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};
