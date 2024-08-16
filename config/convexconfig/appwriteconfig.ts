import { Client, Storage } from "npm:appwrite";
import "@std/dotenv/load";
const appwritecloud = Deno.env.get("APPWRITE_URI");
const appwriteprojectid = Deno.env.get("APPWRITE_PROJECT_ID");
const appwritestorageid = Deno.env.get("APPWRITE_STORAGE_BUCKET_ID");
const client = new Client()
  .setEndpoint(`${appwritecloud}`)
  .setProject(`${appwriteprojectid}`);

const storage = new Storage(client);

const uploadappwrite = (file: any) => {
  const promise = storage.createFile(
    `${appwritestorageid}`,
    crypto.randomUUID(),
    file,
  );
  promise.then(
    function (response: any) {
      console.log("Upload successful:", response); // Success
    },
    function (error: any) {
      console.error("Upload failed:", error); // Failure
    },
  );
};

export default uploadappwrite;
