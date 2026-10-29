const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("COWRYWISE_API_KEY");
    const apiSecret = Deno.env.get("COWRYWISE_API_SECRET");
    const webhookSecret = Deno.env.get("COWRYWISE_WEBHOOK_SECRET");

    const configured = !!(apiKey && apiSecret);

    const health = {
      status: configured ? "available" : "pending",
      message: configured
        ? "Cowrywise sandbox credentials detected."
        : "Cowrywise integration pending access. Credentials not configured.",
      configured,
      sandboxUrl: configured ? "https://sandbox-api.cowrywise.com" : null,
      webhookConfigured: !!webhookSecret,
    };

    return new Response(
      JSON.stringify(health),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, status: "error", configured: false }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
