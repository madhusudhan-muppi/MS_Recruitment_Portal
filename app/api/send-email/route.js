import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { requireAdmin } from "@/lib/auth-guards";

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTransporter() {
  if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export async function POST(req) {
  const { response } = await requireAdmin();
  if (response) return response;

  const transporter = getTransporter();
  if (!transporter) {
    return NextResponse.json(
      { error: "Email service is not configured (missing EMAIL_USERNAME or EMAIL_PASSWORD)" },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { recipients, payloadData } = body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return NextResponse.json(
      { error: "No recipients provided" },
      { status: 400 }
    );
  }

  if (recipients.length > 100) {
    return NextResponse.json(
      { error: "Maximum 100 recipients allowed per request" },
      { status: 400 }
    );
  }

  const cleanBody = sanitizeHtml(payloadData?.body || "", {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "strike", "code",
      "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
      "blockquote", "pre", "hr", "a", "span", "div"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      "*": ["class", "style"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  });

  const chunkSize = 5;
  const succeeded = [];
  const failed = [];

  for (let i = 0; i < recipients.length; i += chunkSize) {
    const chunk = recipients.slice(i, i + chunkSize);

    const results = await Promise.allSettled(
      chunk.map(async (recipient) => {
        let deptName = recipient.Department || "";
        if (deptName === "Web Development" || deptName === "App Development") {
          deptName = "Development Department";
        } else if (deptName === "Photography" || deptName === "Video Editing") {
          deptName = "Photography & Video Editing Department";
        }

        const safeName = escapeHtml(recipient.Name || "");
        const safeDept = escapeHtml(deptName || "");

        let html = `<div>${cleanBody}</div>`;
        html = html.replace(/#name/g, safeName);
        html = html.replace(/#dept/g, safeDept);

        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: recipient.Email,
          subject: payloadData?.subject || "",
          html,
        };

        await transporter.sendMail(mailOptions);
        return recipient.Email;
      })
    );

    results.forEach((res, idx) => {
      const recipientEmail = chunk[idx]?.Email || `unknown-${i + idx}`;
      if (res.status === "fulfilled") {
        succeeded.push(recipientEmail);
      } else {
        console.error(`Failed sending email to ${recipientEmail}:`, res.reason);
        failed.push({
          email: recipientEmail,
          error: res.reason?.message || "Failed to send email",
        });
      }
    });
  }

  return NextResponse.json(
    {
      message: `Processed ${recipients.length} email(s)`,
      succeeded,
      failed,
    },
    { status: 200 }
  );
}
