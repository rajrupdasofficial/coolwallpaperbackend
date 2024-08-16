import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import adminusercreate from "../admincontroller/admin_to_user_profile_controll/user_profile_create_contorller.ts";
import get_all_userprofiledata from "../admincontroller/admin_to_user_profile_controll/get_all_user_profile_data.ts";
import get_all_stored_users from "../admincontroller/admin_user_controller/get_all_user_data.ts";
import updateuserdata from "../admincontroller/admin_user_controller/update_user_data.ts";

const adminucr = new Router();
//admin get all signed up user data
adminucr.get("/api/v1/allusers", get_all_stored_users);
//update users data
adminucr.post("/api/v1/updateusersdata", updateuserdata);
//admin user profile create route
adminucr.post("/api/v1/adminucr", adminusercreate);
//admin retrive all user profile data
adminucr.get("/api/v1/allupd", get_all_userprofiledata);
export default adminucr;