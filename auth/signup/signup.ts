import { Context } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { hash } from "https://deno.land/x/scrypt@v4.2.1/mod.ts";

interface UserData {
  username: string;
  email: string;
  password: string;
}

const userSignup = async (ctx: Context) => {
  const body = await ctx.request.body.json();
  const { username, email, password } = body;

  try {
    const kv = await Deno.openKv();

    // Check if email already exists
    const existingEmail = await kv.get<UserData>(["users", email]);
    if (existingEmail.value !== null && existingEmail.value !== undefined) {
      ctx.response.status = 409;
      ctx.response.body = { message: "Email already exists" };
      return;
    }

    // Hash password
    const hashedPassword = await hash(password);

    // Create user data
    const userData: UserData = {
      username,
      email,
      password: hashedPassword,
    };

    // Store user data
    await kv.set(["users", email], userData);

    ctx.response.status = 201;
    ctx.response.body = { message: "User created successfully" };
  } catch (error) {
    console.error("Error in user signup:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal server error" };
  }
};

export default userSignup;
