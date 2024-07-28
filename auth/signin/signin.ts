import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

interface UserData {
  uid: string;
  username: string;
  email: string;
  password: string;
}

const userSignin = async (ctx: Context) => {
  const env = await load();
  const apikeyheader = ctx.request.headers.get("x-api-key");
  if (!apikeyheader) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Api key is missing" };
    return;
  }

  const apikeyfromenv = env["API_SECUIRTY_KEY"];
  if (apikeyfromenv !== apikeyheader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized access is not allowed" };
    return;
  }

  const body = await ctx.request.body.json();
  const { email, password } = body;

  try {
    const kv = await Deno.openKv();
    // Get user data by email
    const result = await kv.get<UserData>(["users", email]);

    if (result.value === null || result.value === undefined) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }

    const userData: UserData = result.value;

    // Verify password
    const isPasswordValid = await verify(password, userData.password);
    if (!isPasswordValid) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Invalid credentials" };
      return;
    }

    // Password is valid, user is authenticated
    // Generate JWT token
    const key = await crypto.subtle.generateKey(
      { name: "HMAC", hash: "SHA-512" },
      true,
      ["sign", "verify"]
    );

    const jwt = await create(
      { alg: "HS512", typ: "JWT" },
      {
        iss: "coolwallpaperapp",
        exp: getNumericDate(60 * 60), // 1 hour from now
        email: userData.email,
        uid: userData.uid,
      },
      key
    );

    ctx.response.status = 200;
    ctx.response.body = {
      message: "Login successful",
      token: jwt,
      user: {
        uid: userData.uid,
        email: userData.email,
      },
    };
  } catch (error) {
    console.error("Error in user signin:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
};

export default userSignin;
