export async function fetchWebhookUrl() {
  try {
    const res = await fetch("/api/webhook/generate-webhook-url");
    if (!res.ok) {
      throw new Error("Failed to generate webhook URL");
    }

    const data = await res.json();
    return data.webhook_url;
    
  } catch (err) {
    console.error("Error in fetchWebhookUrl():", err);
    throw err;
  }
}
