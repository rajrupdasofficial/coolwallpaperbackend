// userSignin.ts
import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { verify } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
// import { generateJwt } from "./lib/jwt.ts"; // Import the new JWT function
import "@std/dotenv/load";
import generateJwt from "../../lib/jwt.ts";

interface UserData {
  uid: string;
  username: string;
  email: string;
  password: string;
}

const userSignin = async (ctx: Context) => {
  const apikeyheader = ctx.request.headers.get("x-api-key");

  if (!apikeyheader) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Api key is missing" };
    return;
  }

  const apikeyfromenv = Deno.env.get("API_SECUIRTY_KEY");
  if (apikeyfromenv !== apikeyheader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized access is not allowed" };
    return;
  }

  const body = await ctx.request.body.json();
  const { email, password } = body;

  try {
    const kv = await Deno.openKv();
    const result = await kv.get<UserData>(["users", email]);

    if (result.value === null || result.value === undefined) {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
      return;
    }

    const userData: UserData = result.value;
    const isPasswordValid = await verify(password, userData.password);

    if (!isPasswordValid) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Invalid credentials" };
      return;
    }

    // Use the new generateJwt function
    const jwt = await generateJwt(
      { email: userData.email, uid: userData.uid },
      60 * 60 // Token expiration set to 1 hour
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
