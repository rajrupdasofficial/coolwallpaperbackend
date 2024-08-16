import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";
import "@std/dotenv/load";

interface UserProfile {
  userid: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
const adminusercreate = async (ctx: Context) => {
  const apikeyheader = ctx.request.headers.get("x-api-key");
  console.log("api key from header", apikeyheader);
  if (!apikeyheader) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Api key is missing" };
  }
  const apikeyfromenv = Deno.env.get("API_SECUIRTY_KEY");
  console.log("api key from env", apikeyfromenv);
  if (apikeyfromenv !== apikeyheader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized access is not allowed" };
    return;
  }

  const body = await ctx.request.body.json();
  const { userid, firstname, lastname, email, password } = body;
  try {
    const kv = await Deno.openKv();
    const existingEmail = await kv.get<UserProfile>(["userprofiles", email]);
    if (existingEmail.value !== null && existingEmail.value !== undefined) {
      ctx.response.status = 409;
      ctx.response.body = { message: "Email already exists" };
      return;
    }

    const hashedPassword = hash(password);

    const userData: UserProfile = {
      userid,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    };
    await kv.set(["userprofiles", email], userData);
    ctx.response.status = 201;
    ctx.response.body = { message: "User created successfully" };
  } catch (error) {
    console.log(error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
};

export default adminusercreate;
