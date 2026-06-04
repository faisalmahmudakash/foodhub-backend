import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// ================================
// Nodemailer Transporter
// ================================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ================================
// Better Auth Configuration
// ================================
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
      },
      defaultAddress: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: true,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  // ================================
  // Email & Password Auth
  // ================================
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // ================================
  // Email Verification
  // ================================
  emailVerification: {
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const info = await transporter.sendMail({
          from: `"FoodHub Team" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Verify Your Email - FoodHub",

          // ================================
          // Plain Text Version
          // ================================
          text: `
Welcome to FoodHub!

Hello ${user.name},

Please verify your email address by clicking the link below:

${url}

If you did not create an account, you can safely ignore this email.
          `,

          // ================================
          // HTML Email Template
          // ================================
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Email</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background-color:#f4f4f4;
    font-family:Arial, Helvetica, sans-serif;
  "
>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            background-color:#ffffff;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 4px 12px rgba(0,0,0,0.1);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background-color:#ff6b00;
                padding:30px 20px;
                color:white;
              "
            >
              <h1 style="margin:0;font-size:32px;">
                🍔 FoodHub
              </h1>

              <p style="margin-top:10px;font-size:16px;">
                Your Favorite Food Ordering Platform
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 30px;">

              <h2 style="margin-top:0;color:#333333;">
                Verify Your Email
              </h2>

              <p
                style="
                  color:#555555;
                  font-size:16px;
                  line-height:1.7;
                "
              >
                Hello <strong>${user.name}</strong>,
              </p>

              <p
                style="
                  color:#555555;
                  font-size:16px;
                  line-height:1.7;
                "
              >
                Thank you for signing up for FoodHub.
                Please verify your email address to activate your account.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:40px 0;">
                <a
                  href="${url}"
                  style="
                    background-color:#ff6b00;
                    color:#ffffff;
                    padding:14px 30px;
                    text-decoration:none;
                    border-radius:8px;
                    font-size:16px;
                    font-weight:bold;
                    display:inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p
                style="
                  color:#777777;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                If the button above doesn't work, copy and paste the link below into your browser:
              </p>

              <p
                style="
                  word-break:break-all;
                  background:#f8f8f8;
                  padding:12px;
                  border-radius:6px;
                  color:#333333;
                  font-size:14px;
                "
              >
                ${url}
              </p>

              <hr
                style="
                  border:none;
                  border-top:1px solid #eeeeee;
                  margin:40px 0 20px;
                "
              />

              <p
                style="
                  color:#999999;
                  font-size:13px;
                  text-align:center;
                  line-height:1.6;
                "
              >
                If you did not create an account,
                you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                background-color:#fafafa;
                padding:20px;
                color:#999999;
                font-size:13px;
              "
            >
              © 2026 FoodHub. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
          `,
        });

        console.log("✅ Verification email sent!");
        console.log("Message ID:", info.messageId);
      } catch (error: any) {
        console.error("❌ Error sending verification email:");
        console.error(error);
      }
    },
  },
});
