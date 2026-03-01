import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { event, page } = await req.json();
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) return NextResponse.json({ ok: true });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";
    const device = /mobile/i.test(ua) ? "📱 Mobile" : "💻 Desktop";
    const time = new Date().toLocaleString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", hour12: true });

    let emoji = "👆";
    if (event === "signup_click") emoji = "👆";
    else if (event === "pricing_click") emoji = "💲";

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `${emoji} **Button click!** Someone hit "${page || "Get Started"}" — ${device} — ${time} ET`,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
