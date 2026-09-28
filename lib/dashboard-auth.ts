export const DASHBOARD_SESSION_COOKIE = "dashboard_session";
export const DASHBOARD_SESSION_MAX_AGE = 60 * 60 * 8;

const encoder = new TextEncoder();

async function getSigningKey() {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return null;

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index++) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export async function createDashboardSession() {
  const key = await getSigningKey();
  if (!key) throw new Error("Dashboard access is not configured.");

  const expiresAt = Math.floor(Date.now() / 1000) + DASHBOARD_SESSION_MAX_AGE;
  const payload = String(expiresAt);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return {
    token: `${payload}.${toBase64Url(new Uint8Array(signature))}`,
    expiresAt,
  };
}

export async function isValidDashboardSession(token?: string) {
  const key = await getSigningKey();
  if (!key || !token) return false;

  const separator = token.indexOf(".");
  if (separator < 1) return false;

  const payload = token.slice(0, separator);
  const expiresAt = Number(payload);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() / 1000) {
    return false;
  }

  try {
    return await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(token.slice(separator + 1)),
      encoder.encode(payload)
    );
  } catch {
    return false;
  }
}

export function isDashboardPasswordValid(candidate: string) {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) return false;

  const expectedBytes = encoder.encode(expected);
  const candidateBytes = encoder.encode(candidate);
  let difference = expectedBytes.length ^ candidateBytes.length;

  for (let index = 0; index < Math.max(expectedBytes.length, candidateBytes.length); index++) {
    difference |= (expectedBytes[index] ?? 0) ^ (candidateBytes[index] ?? 0);
  }

  return difference === 0;
}