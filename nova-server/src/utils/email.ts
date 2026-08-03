// utils/sendWelcomeMail.ts

import nodemailer from "nodemailer";
import { ENV } from "../config/env";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport(
  {
    host: ENV.SMTP_HOST,
    port: Number(ENV.SMTP_PORT),
    secure: Number(ENV.SMTP_PORT) === 465,
    family: 4,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  } as SMTPTransport.Options
);

const LOGO_URL =
  process.env.LOGO_URL ||
  `${ENV.FRONTEND_URL}/nova.png`;

export async function sendWelcomeMail(email: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Nova.ai" <${ENV.SMTP_FROM}>`,
      to: email,
      subject: "Welcome to Nova",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<title>Welcome to Nova</title>
</head>

<body style="margin:0;padding:0;background:#F4F7FC;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#F4F7FC">
<tr>
<td align="center" style="padding:50px 20px;">

<table width="640" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:22px;overflow:hidden;
box-shadow:0 10px 35px rgba(15,23,42,.08);">

<!-- HERO -->

<tr>
<td
align="center"
style="
padding:55px;
background:linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#06B6D4 100%);
">

<img
src="${LOGO_URL}"
width="110"
alt="Nova"
style="display:block;margin-bottom:24px;">

<div style="
color:white;
font-size:38px;
font-weight:700;
line-height:48px;
">
Welcome to Nova
</div>

<div style="
margin-top:18px;
color:#EEF2FF;
font-size:18px;
line-height:30px;
max-width:470px;
">
Your intelligent AI companion for conversations, creativity,
productivity, coding, and everyday problem solving.
</div>

</td>
</tr>

<!-- BODY -->

<tr>

<td style="padding:50px;">

<div style="
font-size:28px;
font-weight:700;
color:#111827;
margin-bottom:20px;
">
You're all set 🚀
</div>

<div style="
font-size:17px;
line-height:32px;
color:#475569;
">

Thanks for joining Nova.

Your AI companion is ready to help you brainstorm ideas, write content,
generate code, solve complex problems, summarize information, and assist
with your daily workflow—all from one beautiful workspace.

Start exploring and discover how Nova can make every task faster,
smarter, and more enjoyable.

</div>

<!-- FEATURES -->

<table
width="100%"
cellpadding="18"
cellspacing="0"
style="margin-top:40px;">

<tr>

<td style="
border:1px solid #E5E7EB;
border-radius:12px;
padding:18px;
">

<div style="font-size:18px;font-weight:600;color:#111827;">
🧠 AI Conversations
</div>

<div style="margin-top:8px;color:#64748B;font-size:15px;line-height:26px;">
Chat naturally with an intelligent AI that understands context.
</div>

</td>

</tr>

<tr>

<td style="
border:1px solid #E5E7EB;
border-radius:12px;
padding:18px;
">

<div style="font-size:18px;font-weight:600;color:#111827;">
✍️ Writing Assistant
</div>

<div style="margin-top:8px;color:#64748B;font-size:15px;line-height:26px;">
Create emails, blogs, reports, and professional content in seconds.
</div>

</td>

</tr>

<tr>

<td style="
border:1px solid #E5E7EB;
border-radius:12px;
padding:18px;
">

<div style="font-size:18px;font-weight:600;color:#111827;">
💻 Code Generation
</div>

<div style="margin-top:8px;color:#64748B;font-size:15px;line-height:26px;">
Generate, explain, debug, and optimize code across multiple languages.
</div>

</td>

</tr>

<tr>

<td style="
border:1px solid #E5E7EB;
border-radius:12px;
padding:18px;
">

<div style="font-size:18px;font-weight:600;color:#111827;">
📄 Smart Summaries
</div>

<div style="margin-top:8px;color:#64748B;font-size:15px;line-height:26px;">
Instantly summarize documents, articles, and long conversations.
</div>

</td>

</tr>

<tr>

<td style="
border:1px solid #E5E7EB;
border-radius:12px;
padding:18px;
">

<div style="font-size:18px;font-weight:600;color:#111827;">
⚡ Productivity Boost
</div>

<div style="margin-top:8px;color:#64748B;font-size:15px;line-height:26px;">
Plan projects, organize ideas, and complete work more efficiently.
</div>

</td>

</tr>

</table>

<!-- BUTTON -->

<div style="text-align:center;margin:50px 0 20px;">

<a
href="${ENV.FRONTEND_URL}"
style="
display:inline-block;
padding:16px 40px;
background:#6366F1;
color:white;
font-size:17px;
font-weight:bold;
text-decoration:none;
border-radius:10px;
">

Start Using Nova →

</a>

</div>

<div style="
font-size:15px;
line-height:28px;
color:#64748B;
text-align:center;
">

Whether you're writing, coding, researching, learning, or planning,
Nova is always ready to help you achieve more with AI.

</div>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
style="
padding:35px;
background:#F8FAFC;
text-align:center;
border-top:1px solid #E2E8F0;
">

<img
src="${LOGO_URL}"
width="42"
style="margin-bottom:15px;">

<div
style="
font-size:20px;
font-weight:700;
color:#111827;
">

Nova

</div>

<div
style="
margin-top:8px;
color:#64748B;
font-size:15px;
">

Think Better • Create Faster • Powered by AI

</div>

<div
style="
margin-top:25px;
color:#94A3B8;
font-size:13px;
">

© ${new Date().getFullYear()} Nova AI. All rights reserved.

</div>

</td>

</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
    });

    return true;
  } catch (error) {
    console.error("Welcome email:", error);
    return false;
  }
}



const LOGO_URL_RESET =
  `${ENV.FRONTEND_URL}/aether_logo.png`;

export async function sendResetPasswordMail(
  email: string,
  resetUrl: string,
  name?: string
): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Aether.ai" <${ENV.SMTP_FROM}>`,
      to: email,
      subject: "Reset your Aether password",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<title>Reset your password</title>
</head>

<body style="margin:0;padding:0;background:#F4F7FC;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#F4F7FC">
<tr>
<td align="center" style="padding:50px 20px;">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:22px;overflow:hidden;
box-shadow:0 10px 35px rgba(15,23,42,.08);">

<!-- HERO -->
<tr>
<td
align="center"
style="
padding:45px;
background:linear-gradient(135deg,#2563EB 0%,#4F46E5 55%,#06B6D4 100%);
">

<img
src="${LOGO_URL_RESET}"
width="90"
alt="Aether"
style="display:block;margin-bottom:20px;">

<div style="
color:white;
font-size:30px;
font-weight:700;
line-height:40px;
">
Reset your password
</div>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:50px;">

<div style="
font-size:17px;
line-height:30px;
color:#475569;
">

Hi${name ? ` ${name}` : ""},<br><br>

We received a request to reset the password for your Aether account
(<strong>${email}</strong>). Click the button below to choose a new password.

</div>

<div style="text-align:center;margin:40px 0 20px;">
<a

href="${resetUrl}"
style="
display:inline-block;
padding:16px 40px;
background:#2563EB;
color:white;
font-size:17px;
font-weight:bold;
text-decoration:none;
border-radius:10px;
">
Reset Password
</a>
</div>

<div style="
font-size:14px;
line-height:24px;
color:#94A3B8;
text-align:center;
margin-top:10px;
">
This link expires in 1 hour. If you didn't request a password reset,
you can safely ignore this email — your password will not be changed.
</div>



</td>
</tr>

<!-- FOOTER -->
<tr>
<td
style="
padding:35px;
background:#F8FAFC;
text-align:center;
border-top:1px solid #E2E8F0;
">

<img
src="${LOGO_URL_RESET}"
width="36"
style="margin-bottom:12px;">

<div style="font-size:18px;font-weight:700;color:#111827;">
Aether
</div>

<div style="margin-top:8px;color:#64748B;font-size:14px;">
Build Smarter • Ship Faster • Powered by AI
</div>

<div style="margin-top:20px;color:#94A3B8;font-size:12px;">
© ${new Date().getFullYear()} Aether.ai
</div>

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

    return true;
  } catch (error) {
    console.error("Reset password email:", error);
    return false;
  }
}