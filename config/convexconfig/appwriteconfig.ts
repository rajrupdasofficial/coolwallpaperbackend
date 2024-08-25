import { Client, Storage } from "npm:appwrite";
import "@std/dotenv/load";

interface ImageMetadata {
  filename: string;
  useruid: string;
}

const appwritecloud = Deno.env.get("APPWRITE_URI");
const appwriteprojectid = Deno.env.get("APPWRITE_PROJECT_ID");
const appwritestorageid = Deno.env.get("APPWRITE_STORAGE_BUCKET_ID");
const client = new Client()
  .setEndpoint(`${appwritecloud}`)
  .setProject(`${appwriteprojectid}`);

const storage = new Storage(client);

const uploadappwrite = async (
  file: any,
  user_uid: any,
): Promise<{ success?: any; error?: string }> => {
  try {
    // Create a file in Appwrite storage
    const randomimageid = crypto.randomUUID();
    const response = await storage.createFile(
      `${appwritestorageid}`,
      randomimageid,
      file,
    );
    //save image metadata in kv
    console.log("randomuseridinappwriteconfig", user_uid);
    const kv = await Deno.openKv();
    const imagemetadata: ImageMetadata = {
      filename: file.name,
      useruid: user_uid,
    };
    await kv.set(["imagemetadata", randomimageid], imagemetadata);
    console.log("Upload successful:", response); // Success log
    return { success: response }; // Return successful response
  } catch (error) {
    console.error("Upload failed:", error); // Error log
    return { error: error.message || "An error occurred during upload." }; // Return error response
  }
};

export default uploadappwrite;
