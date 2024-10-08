import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { resolve } from "jsr:@std/path@0.223/posix";
import uploadappwrite from "../config/convexconfig/appwriteconfig.ts";

const imageupload = async (ctx: Context) => {
  // Set CORS headers
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204; // No content
    return;
  }

  try {
    const reqBody = await ctx.request.body.formData();
    console.log("reqbodydata", reqBody);
    const user_uid = reqBody.get("uid") ?? "";
    console.log("user_uid", user_uid);
    for (const pair of reqBody.entries()) {
      const field = pair[0],
        val = pair[1];
      if (val instanceof File) {
        console.log("File", field, val);
        const arraybuffer = await val.arrayBuffer();
        const uint8Array = new Uint8Array(arraybuffer);
        const uploader = await uploadappwrite(val, user_uid);
        if (uploader.success) {
          ctx.response.status = 200;
          ctx.response.body = { message: "Upload successful" };
        } else {
          ctx.response.body = 500;
          ctx.response.body = {
            message: "error occurred",
            data: uploader.error,
          };
        }
      } else {
        console.log("Field", field, val);
      }
    }
  } catch (error) {
    console.error("Error in imageupload:", error);
    ctx.response.status = 500;
    ctx.response.body = JSON.stringify({
      status: "error",
      message: error.message,
    });
  }
};

export default imageupload;
