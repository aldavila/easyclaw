const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_API_URL = "https://app.loops.so/api/v1";

async function loopsRequest(endpoint: string, body: Record<string, unknown>) {
  if (!LOOPS_API_KEY) {
    console.log("[Loops] No API key configured, skipping:", endpoint);
    return null;
  }
  try {
    const res = await fetch(`${LOOPS_API_URL}${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOOPS_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) console.error("[Loops] Error:", endpoint, data);
    return data;
  } catch (err) {
    console.error("[Loops] Request failed:", endpoint, err);
    return null;
  }
}

/** Add or update a contact in Loops audience */
export async function addContact(email: string, properties?: Record<string, unknown>) {
  return loopsRequest("/contacts/update", {
    email,
    source: "easyclaw",
    ...properties,
  });
}

/** Send an event to trigger Loop automations */
export async function sendEvent(email: string, eventName: string, eventProperties?: Record<string, unknown>) {
  return loopsRequest("/events/send", {
    email,
    eventName,
    ...(eventProperties ? { eventProperties } : {}),
  });
}

/** Send a transactional email */
export async function sendTransactional(email: string, transactionalId: string, dataVariables?: Record<string, unknown>) {
  return loopsRequest("/transactional", {
    email,
    transactionalId,
    ...(dataVariables ? { dataVariables } : {}),
  });
}

// ---- Pre-built event helpers ----

export async function onUserSignup(email: string, name?: string) {
  await addContact(email, {
    firstName: name?.split(" ")[0] || "",
    lastName: name?.split(" ").slice(1).join(" ") || "",
    userGroup: "easyclaw",
  });
  await sendEvent(email, "signup");
}

export async function onCheckoutStarted(email: string) {
  await sendEvent(email, "checkout_started");
}

export async function onSubscriptionActive(email: string, plan: string) {
  await sendEvent(email, "subscription_active", { plan });
}

export async function onInstanceDeployed(email: string, instanceName: string) {
  await sendEvent(email, "instance_deployed", { instanceName });
}
