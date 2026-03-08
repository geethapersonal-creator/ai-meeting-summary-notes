import { supabase } from "@/integrations/supabase/client";

const EMAIL_RESPOND_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/email-respond`;

export interface EmailResponse {
  summary: string;
  suggestedResponse: string;
}

export async function processEmail(
  email: string,
  tone: string = "professional"
): Promise<EmailResponse> {
  const resp = await fetch(EMAIL_RESPOND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ email, tone }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || `Error ${resp.status}`);
  }

  return resp.json();
}

export async function saveEmailHistory(
  originalEmail: string,
  summary: string,
  suggestedResponse: string,
  tone: string
) {
  const { error } = await supabase.from("email_history").insert({
    original_email: originalEmail,
    summary,
    suggested_response: suggestedResponse,
    response_tone: tone,
  });

  if (error) {
    console.error("Failed to save email history:", error);
  }
}

export async function getEmailHistory() {
  const { data, error } = await supabase
    .from("email_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch email history:", error);
    return [];
  }

  return data || [];
}
