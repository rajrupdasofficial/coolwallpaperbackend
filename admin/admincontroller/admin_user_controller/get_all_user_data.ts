import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import "@std/dotenv/load";

const get_all_stored_users = async (ctx: Context) => {
  const apikeyheader = ctx.request.headers.get("x-api-key");
  console.log("api key from header", apikeyheader);
  if (!apikeyheader) {
    ctx.response.status = 403;
    ctx.response.body = { message: "Api key is missing" };
    return;
  }
  const apikeyfromenv = Deno.env.get("API_SECUIRTY_KEY");
  console.log("api key from env", apikeyfromenv);
  if (apikeyfromenv !== apikeyheader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized access is not allowed" };
    return;
  }
  const kv = await Deno.openKv();
  const entries = kv.list({ prefix: ["users"] });
  const userprofiles = await Array.fromAsync(entries);
  if (userprofiles.length > 0) {
    ctx.response.status = 200;
    ctx.response.body = { message: "All of the data", data: userprofiles };
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "No users hasbeen found in the database" };
  }
};
export default get_all_stored_users;
