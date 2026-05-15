export type LeadPayload = {
  email: string;
  company: string;
  website?: string;
  monthlyAdSpend?: string;
  crm?: string;
  message?: string;
  consent: boolean;
  source?: string;
  utm?: Record<string, string>;
};

export type EnrichedLeadPayload = LeadPayload & {
  submittedAt: string;
  userAgent?: string;
  ip?: string;
  pageUrl?: string;
};

export function buildLeadSummary(payload: LeadPayload) {
  return {
    email: payload.email.trim().toLowerCase(),
    company: payload.company.trim(),
    website: payload.website?.trim() || undefined,
    monthlyAdSpend: payload.monthlyAdSpend || undefined,
    crm: payload.crm || undefined,
    message: payload.message?.trim() || undefined,
    consent: payload.consent,
    source: payload.source || 'website',
    utm: payload.utm || {},
  };
}

export async function forwardToCrm(webhookUrl: string, payload: EnrichedLeadPayload) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authHeader = process.env.CRM_AUTH_HEADER?.trim();
  const authToken = process.env.CRM_AUTH_TOKEN?.trim();

  if (authHeader && authToken) {
    headers[authHeader] = authToken;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const text = await response.text().catch(() => '');

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body: text,
  };
}
