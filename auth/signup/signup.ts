import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { hash } from "jsr:@denorg/scrypt@4.4.4";

const userSignup = async (ctx: Context) => {
  const body = ctx.request.body;
  const responsebody = await body.json();

  const signupbody = {
    username: responsebody.username,
    email: responsebody.email,
    password: responsebody.password,
  };

  try {
    const kv = await Deno.openKv();

    // Check if username or email already exists
    const existingUsername = await kv.get(["users", signupbody.username]);
    const existingEmail = await kv.get(["emails", signupbody.email]);

    // Log the existing values for debugging
    console.log("Existing Username:", existingUsername.value);
    console.log("Existing Email:", existingEmail.value);

    if (existingUsername.value !== null || existingEmail.value !== null) {
      ctx.response.status = 409;
      ctx.response.body = {
        message: "Email or username already exists in the database",
      };
      return;
    }

    const hashPassword = await hash(signupbody.password);
    const userData = {
      username: signupbody.username,
      email: signupbody.email,
      password: hashPassword,
    };

    // Store user data and email mapping
    await Promise.all([
      kv.set(["users", signupbody.username], userData),
      kv.set(["emails", signupbody.email], signupbody.username),
    ]);

    ctx.response.status = 201;
    ctx.response.body = { message: "User created successfully" };
  } catch (error) {
    console.log("Error in user sign up", error);
    ctx.response.status = 500;
    ctx.response.body = { message: `Internal server error ${error}` };
  }
};

export default userSignup;
