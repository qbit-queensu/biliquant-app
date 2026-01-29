// @deno-types="npm:@types/node"
// supabase/functions/contact-email/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = {
  name: string;
  email: string;
  message: string;
};

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { name, email, message } = (await req.json()) as Payload;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const toEmail = Deno.env.get("CONTACT_TO_EMAIL")!;
    const fromEmail = Deno.env.get("CONTACT_FROM_EMAIL")!; // e.g. "QBiT <contact@yourdomain.com>"

    const supabase = createClient(supabaseUrl, serviceKey);

    // 1) store in DB
    const { data, error: insertError } = await supabase
      .from("contact_messages")
      .insert([{ name: name.trim(), email: email.trim(), message: message.trim() }])
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("DB insert error:", insertError);
      return new Response(JSON.stringify({ error: "DB insert failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2) send email via Resend
    const subject = `New Contact Form Submission from ${name.trim()}`;

    const emailHtml = `
      <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
        <h2>${subject}</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space: pre-wrap; background:#f6f6f6; padding:12px; border-radius:8px">${escapeHtml(message)}</pre>
        <hr/>
        <p style="color:#666; font-size:12px">ID: ${data.id} • ${data.created_at}</p>
      </div>
    `;

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email.trim(),
        subject,
        html: emailHtml,
      }),
    });

    if (!resendResp.ok) {
      const body = await resendResp.text();
      console.error("Resend error:", resendResp.status, body);
      return new Response(JSON.stringify({ error: "Email failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Function error:", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// minimal HTML escaping
function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
