const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "EasyClaw <onboarding@resend.dev>";

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log("[Email] No RESEND_API_KEY configured, skipping:", subject);
    return null;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) console.error("[Email] Error:", data);
    return data;
  } catch (err) {
    console.error("[Email] Send failed:", err);
    return null;
  }
}

// ---- Shared styles ----
const wrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:32px;">⚡</span>
      <span style="font-size:22px;font-weight:bold;color:#fff;margin-left:8px;">EasyClaw</span>
    </div>
    ${content}
    <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #1e1e1e;">
      <p style="color:#666;font-size:12px;margin:0;">© 2026 EasyClaw. All rights reserved.</p>
      <p style="color:#666;font-size:12px;margin:4px 0 0;">You're receiving this because you signed up at easyclaw-app.vercel.app</p>
    </div>
  </div>
</body>
</html>`;

const button = (text: string, url: string) =>
  `<div style="text-align:center;margin:28px 0;">
    <a href="${url}" style="display:inline-block;background:#6366f1;color:#fff;padding:14px 32px;border-radius:12px;font-weight:600;font-size:16px;text-decoration:none;">${text}</a>
  </div>`;

const heading = (text: string) =>
  `<h1 style="color:#fff;font-size:26px;font-weight:bold;margin:0 0 16px;text-align:center;">${text}</h1>`;

const paragraph = (text: string) =>
  `<p style="color:#aaa;font-size:15px;line-height:1.6;margin:0 0 16px;">${text}</p>`;

const card = (content: string) =>
  `<div style="background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:32px;margin:24px 0;">${content}</div>`;

// ---- Email templates ----

export async function sendWelcomeEmail(to: string, name?: string) {
  const firstName = name?.split(" ")[0] || "there";
  return sendEmail(to, "Welcome to EasyClaw ⚡", wrapper(
    card(
      heading(`Hey ${firstName}, welcome!`) +
      paragraph("You just joined EasyClaw. You're one step away from having your own AI assistant running 24/7 on Telegram.") +
      paragraph("Here's what happens next:") +
      `<div style="margin:16px 0;">
        <div style="display:flex;align-items:start;margin-bottom:12px;">
          <span style="color:#6366f1;font-weight:bold;margin-right:12px;font-size:18px;">1.</span>
          <span style="color:#ccc;font-size:14px;">Subscribe to activate your account ($24/mo)</span>
        </div>
        <div style="display:flex;align-items:start;margin-bottom:12px;">
          <span style="color:#6366f1;font-weight:bold;margin-right:12px;font-size:18px;">2.</span>
          <span style="color:#ccc;font-size:14px;">Create a Telegram bot via @BotFather (takes 2 min)</span>
        </div>
        <div style="display:flex;align-items:start;margin-bottom:12px;">
          <span style="color:#6366f1;font-weight:bold;margin-right:12px;font-size:18px;">3.</span>
          <span style="color:#ccc;font-size:14px;">Paste your API key and bot token in the dashboard</span>
        </div>
        <div style="display:flex;align-items:start;">
          <span style="color:#6366f1;font-weight:bold;margin-right:12px;font-size:18px;">4.</span>
          <span style="color:#ccc;font-size:14px;">Hit deploy. Your AI goes live in under 90 seconds.</span>
        </div>
      </div>` +
      button("Go to Dashboard →", "https://easyclaw-app.vercel.app/dashboard")
    ) +
    paragraph("Questions? Just reply to this email.")
  ));
}

export async function sendPaymentConfirmation(to: string, name?: string) {
  const firstName = name?.split(" ")[0] || "there";
  return sendEmail(to, "You're subscribed! Time to deploy ⚡", wrapper(
    card(
      heading("Payment confirmed! 🎉") +
      paragraph(`${firstName}, your EasyClaw subscription is active. You're now ready to deploy your AI assistant.`) +
      paragraph("Your plan includes:") +
      `<ul style="color:#ccc;font-size:14px;line-height:2;padding-left:20px;margin:12px 0;">
        <li>Your own isolated server</li>
        <li>Telegram integration</li>
        <li>Any AI model (BYOK)</li>
        <li>Custom personality (SOUL.md editor)</li>
        <li>Skills, plugins, cron jobs</li>
        <li>Full dashboard + auto-recovery</li>
      </ul>` +
      button("Deploy Your Agent →", "https://easyclaw-app.vercel.app/dashboard")
    )
  ));
}

export async function sendInstanceReady(to: string, instanceName: string, serverIp?: string) {
  return sendEmail(to, `Your agent "${instanceName}" is live! 🚀`, wrapper(
    card(
      heading("Your AI is live! 🚀") +
      paragraph(`Your agent <strong style="color:#fff;">"${instanceName}"</strong> has been deployed and is running.`) +
      (serverIp ? `<div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:8px;padding:12px 16px;margin:16px 0;">
        <span style="color:#888;font-size:13px;">Server IP:</span>
        <span style="color:#fff;font-family:monospace;margin-left:8px;">${serverIp}</span>
      </div>` : "") +
      paragraph("Open Telegram and send a message to your bot. It should respond within seconds.") +
      paragraph("You can manage your agent, edit its personality, and restart it from the dashboard.") +
      button("Open Dashboard →", "https://easyclaw-app.vercel.app/dashboard")
    )
  ));
}

export async function sendCheckoutReminder(to: string, name?: string) {
  const firstName = name?.split(" ")[0] || "there";
  return sendEmail(to, "You're almost there — finish your setup", wrapper(
    card(
      heading("Still thinking about it?") +
      paragraph(`${firstName}, you signed up for EasyClaw but haven't subscribed yet. Your AI assistant is waiting to be deployed.`) +
      paragraph("Most people get their bot running in under 5 minutes. Here's all you need:") +
      `<ul style="color:#ccc;font-size:14px;line-height:2;padding-left:20px;margin:12px 0;">
        <li>An AI API key (Anthropic, OpenAI, or Google)</li>
        <li>A Telegram bot token (free from @BotFather)</li>
      </ul>` +
      button("Subscribe & Deploy — $24/mo →", "https://easyclaw-app.vercel.app/dashboard")
    ) +
    paragraph("Questions? Just reply to this email. We read every one.")
  ));
}
