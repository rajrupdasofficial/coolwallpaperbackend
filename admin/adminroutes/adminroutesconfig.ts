import {Router} from "https://deno.land/x/oak@v16.1.0/mod.ts"
import adminusercreate from "../admincontroller/admin_to_user_controll/user_create_contorller.ts"
import  get_all_userprofiledata   from "../admincontroller/admin_to_user_controll/get_all_user_data.ts"
const adminucr = new Router();
//admin user profile create route
adminucr.post("/api/v1/adminucr",adminusercreate)
//admin retrive all user profile data
adminucr.get("/api/v1/allupd",get_all_userprofiledata)
export default adminucr
