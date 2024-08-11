import { Context } from "jsr:@oak/oak/";
import { hash, verify } from "jsr:@denorg/scrypt@4.4.4"
import "@std/dotenv/load";

interface UpdateUserProfile{
  uid:string;
  username:string;
  firstname:string;
  lastname:string;
  email:string;
  password:string;
    userimage:string;
}

const updateprofile = async(ctx:Context)=>{
 const apikeyheader = ctx.request.headers.get("x-api-key")
  if(!apikeyheader){
    ctx.response.status = 404
    ctx.response.body = {message:"API Key is missing"}
  }
  const apikeyfromenv = null
 // {}

}
