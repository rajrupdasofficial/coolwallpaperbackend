//get all stored media from database
import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import "@std/dotenv/load";

const get_all_media_data = async (ctx: Context) => {
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
  const entries = kv.list({ prefix: ["imagemetadata"] });
  const imadedatafromkv = await Array.fromAsync(entries);
  if (imadedatafromkv.length === 0 || imadedatafromkv === null) {
    ctx.response.status = 404;
    ctx.response.body = { message: "No image is present in database" };
    return; // Add this return statement
  }
  ctx.response.status = 200;
  ctx.response.body = { message: "all of the data", data: imadedatafromkv };
};

export default get_all_media_data;
