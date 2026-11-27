
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const respond = (data: object, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  if (req.method !== "POST") {
    return respond({ error: "Method not allowed" }, 405);
  }

  try {
    const { username, pin } = await req.json();

    const cleanUsername = String(username ?? "")
      .trim()
      .toLowerCase();

    const cleanPin = String(pin ?? "");

    if (!/^[a-z0-9_]{3,24}$/.test(cleanUsername)) {
      return respond({
        error: "Username must be 3–24 characters using letters, numbers or underscores."
      }, 400);
    }

    if (!/^[0-9]{8,12}$/.test(cleanPin)) {
      return respond({
        error: "Your PIN must contain 8–12 digits."
      }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return respond({ error: "Server configuration is missing." }, 500);
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Each username maps to an internal, non-personal email.
    const internalEmail = `${cleanUsername}@twoofus.invalid`;

    const { data: account, error: accountError } =
      await admin.auth.admin.createUser({
        email: internalEmail,
        password: cleanPin,
        email_confirm: true,
        user_metadata: {
          username: cleanUsername,
        },
      });

    if (accountError || !account.user) {
      return respond({
        error: "Account could not be created. The username may already be taken."
      }, 400);
    }

    const { error: profileError } = await admin
      .from("profiles")
      .insert({
        id: account.user.id,
        username: cleanUsername,
      });

    if (profileError) {
      await admin.auth.admin.deleteUser(account.user.id);

      return respond({
        error: "Could not finish creating your profile."
      }, 500);
    }

    return respond({
      success: true,
      message: "Your account has been created."
    });

  } catch {
    return respond({ error: "Something went wrong." }, 500);
  }
});
