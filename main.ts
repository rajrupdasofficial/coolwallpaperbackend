import { Application } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import userauthrouter from "./routes/routes.ts";
import adminucr from "./admin/adminroutes/adminroutesconfig.ts"
const app = new Application();
app.use(userauthrouter.routes());

app.use(userauthrouter.allowedMethods());
app.use(adminucr.routes())
app.use(adminucr.allowedMethods());


await app.listen({ hostname: "127.0.0.1", port: 8000 });
