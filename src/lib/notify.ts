const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

/** Send a notification to Discord webhook */
async function discordNotify(content: string) {
  if (!DISCORD_WEBHOOK_URL) {
    console.log("[Notify] No Discord webhook configured, skipping");
    return;
  }
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  } catch (err) {
    console.error("[Notify] Discord webhook failed:", err);
  }
}

export async function notifyNewUser(email: string, name?: string) {
  await discordNotify(`🆕 **New signup!** ${name || "Unknown"} (${email})`);
}

export async function notifyCheckout(email: string) {
  await discordNotify(`💳 **Checkout started** by ${email}`);
}

export async function notifyPayment(email: string, plan: string) {
  await discordNotify(`💰 **New payment!** ${email} subscribed to ${plan} ($24/mo)`);
}

export async function notifyDeploy(email: string, instanceName: string) {
  await discordNotify(`🚀 **Instance deployed!** ${email} launched "${instanceName}"`);
}

export async function notifyError(context: string, error: string) {
  await discordNotify(`🔴 **Error** in ${context}: ${error}`);
}
