import crypto from "crypto";

const base64UrlJson = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const parseExpiresIn = (expiresIn) => {
  if (typeof expiresIn === "number") return expiresIn;
  if (!expiresIn) return null;

  const match = String(expiresIn).trim().match(/^(\d+)([smhd])?$/i);
  if (!match) {
    throw new Error("JWT_EXPIRES_IN must use s, m, h, or d, for example 7d");
  }

  const value = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();
  const multipliers = { s: 1, m: 60, h: 60 * 60, d: 24 * 60 * 60 };
  return value * multipliers[unit];
};

const sign = (data, secret) =>
  crypto.createHmac("sha256", secret).update(data).digest("base64url");

const requireSecret = (secret) => {
  if (!secret) throw new Error("JWT_SECRET is required");
  return secret;
};

export const signJwt = (payload, secret, options = {}) => {
  const jwtSecret = requireSecret(secret);
  const now = Math.floor(Date.now() / 1000);
  const expiresInSeconds = parseExpiresIn(options.expiresIn);
  const body = { ...payload, iat: now };

  if (expiresInSeconds) {
    body.exp = now + expiresInSeconds;
  }

  const header = { alg: "HS256", typ: "JWT" };
  const unsignedToken = `${base64UrlJson(header)}.${base64UrlJson(body)}`;
  return `${unsignedToken}.${sign(unsignedToken, jwtSecret)}`;
};

export const verifyJwt = (token, secret) => {
  const jwtSecret = requireSecret(secret);
  const parts = token.split(".");

  if (parts.length !== 3) throw new Error("Invalid token format");

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(unsignedToken, jwtSecret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid token signature");
  }

  const header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString("utf8"));
  if (header.alg !== "HS256") throw new Error("Invalid token algorithm");

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp <= now) {
    throw new Error("Token expired");
  }

  return payload;
};
