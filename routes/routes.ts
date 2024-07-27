import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import userSignup from "../auth/signup/signup.ts";

const userauthrouter = new Router();

userauthrouter.post("/api/v1/signup", userSignup);

export default userauthrouter;
