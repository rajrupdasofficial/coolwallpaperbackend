import { Context } from "jsr:@oak/oak";
import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

interface User {
  uid: string;
  username: string;
  email: string;
  password: string;
}

interface UpdateUserPayload {
  uid?: string;
  username?: string;
  email?: string;
  password?: string;
}

const updateuserdata = async (ctx: Context) => {
  const apikeyheader = ctx.request.headers.get("x-api-key");
  if (!apikeyheader) {
    ctx.response.status = 404;
    ctx.response.body = { message: "API Key is missing" };
    return;
  }

  const apikeyfromenv = Deno.env.get("API_SECUIRTY_KEY");
  if (apikeyfromenv !== apikeyheader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized access is not allowed" };
    return;
  }

  const body = await ctx.request.body.json();
  const updatePayload = body as UpdateUserPayload;

  if (Object.keys(updatePayload).length === 0) {
    ctx.response.status = 400;
    ctx.response.body = { message: "No fields provided for update" };
    return;
  }

  const kv = await Deno.openKv();
  const result = await kv.get(["users", updatePayload.email || ""]);

  if (result.value === null || result.value === undefined) {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
    return;
  }

  const currentUser = result.value as User;

  // Update only the fields that are provided
  const updatedUser: User = {
    ...currentUser,
    username: updatePayload.username || currentUser.username,
    email: updatePayload.email || currentUser.email,
  };

  // Hash the new password if provided
  if (updatePayload.password) {
    updatedUser.password = hash(updatePayload.password);
  }

  // Save the updated data back to the database
  const setResult = await kv.set(["users", updatedUser.email], updatedUser);

  if (setResult.ok) {
    ctx.response.status = 200;
    ctx.response.body = {
      message: "User data updated successfully",
      user: { ...updatedUser, password: undefined }, // Exclude password from response
    };
  } else {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to update user data" };
  }
};

export default updateuserdata;
