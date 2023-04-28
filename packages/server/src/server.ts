import middleware from "./middleware";

import App from "./application";

import APIRoutes from "./routes/api.router";
import AuthRoutes from "./routes/auth.router";

const port: number | string = process.env.PORT || 6060;

const app = new App(port, middleware, [APIRoutes], [AuthRoutes]);

app.listen();
