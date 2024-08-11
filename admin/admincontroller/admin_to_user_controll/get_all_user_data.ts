//get all of the users from kv 

import {Context} from "https://deno.land/x/oak@v16.1.0/mod.ts"
import "@std/dotenv/load";
const get_all_userprofiledata = async(ctx:Context)=>{
 const apikeyheader = ctx.request.headers.get("x-api-key")
  console.log("api key from header",apikeyheader)
  if(!apikeyheader){
  ctx.response.status = 403;
  ctx.response.body = {message:"Api key is missing"}
  return
  }
  const apikeyfromenv = Deno.env.get("API_SECUIRTY_KEY")
  console.log("api key from env",apikeyfromenv)
  if(apikeyfromenv!==apikeyheader){
      ctx.response.status = 401;
      ctx.response.body = { message: "Unauthorized access is not allowed" };
      return;
 }
 const kv = await Deno.openKv();
   const entries = kv.list({ prefix: ["userprofiles"] });
   const userprofiles = await Array.fromAsync(entries);
   console.log(userprofiles);
}


export default get_all_userprofiledata
