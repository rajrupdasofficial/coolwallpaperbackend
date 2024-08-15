import { Application } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import userauthrouter from "./routes/routes.ts";
import adminucr from "./admin/adminroutes/adminroutesconfig.ts";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@v2.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();
// Use CORS middleware
app.use(
  oakCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
); // This will allow all cross-origin requests

app.use(userauthrouter.routes());
app.use(userauthrouter.allowedMethods());
app.use(adminucr.routes());
app.use(adminucr.allowedMethods());

await app.listen({ hostname: "0.0.0.0", port: 8000 });
