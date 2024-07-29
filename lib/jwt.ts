// lib/jwt.ts
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const generateJwt = async (
  payload: Record<string, unknown>,
  expiresIn: number
) => {
  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );

  const jwt = await create(
    { alg: "HS512", typ: "JWT" },
    {
      iss: "coolwallpaperapp",
      exp: getNumericDate(expiresIn), // Set expiration time
      ...payload, // Spread the payload to include any additional claims
    },
    key
  );

  return jwt;
};

export default generateJwt;
