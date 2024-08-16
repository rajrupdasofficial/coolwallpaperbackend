import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import userSignup from "../auth/signup/signup.ts";
import userSignin from "../auth/signin/signin.ts";
import imageupload from "../controller/wallpapercreatecontroller.ts"
const userauthrouter = new Router();

userauthrouter.post("/api/v1/signup", userSignup);
userauthrouter.post("/api/v1/login", userSignin);
userauthrouter.post("/api/v1/imageupload",imageupload)
export default userauthrouter;
