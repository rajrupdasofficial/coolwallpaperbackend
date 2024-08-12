import {Context} from  "jsr:@oak/oak/"
import { multiParser, FormFile } from "https://deno.land/x/multiparser@v2.1.0/mod.ts";

const imageupload = async(ctx:Context)=>{
    const form = await multiParser(ctx.request.serverRequest);
	console.log(form)
 if (form && form.files) {
      const image: FormFile = form.files.image as FormFile;
	console.log(image)
      try {
        await Deno.writeFile(`images/${image.filename}`, image.content);
        ctx.response.body = { status: "ok", message: "Image uploaded successfully" };
      } catch (e) {
        console.error(e);
        ctx.response.body = { status: "error", message: "Error uploading image" };
      }
    } else {
      ctx.response.body = { status: "error", message: "No file uploaded" };
    }
  }

export default imageupload;
