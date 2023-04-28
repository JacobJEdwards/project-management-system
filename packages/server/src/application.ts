import { Application } from "express";
import express, { Router } from "express";
import { createServer, Server } from "http";

export default class App {
    public app: Application;

    constructor(
        private port: number | string,
        middleware: any[],
        apiRoutes: Array<Router>,
        authRoutes: Array<Router>,
        private apiPath: string = "/api",
        private authPath: string = "/auth"
    ) {
        this.app = express();
        this.port = this.normalizePort(port) as number;
        this.app.set("port", this.port);

        this.middlewares(middleware);
        this.apiRoutes(apiRoutes);
        this.authRoutes(authRoutes);
    }

    private middlewares(middleware: any[]) {
        middleware.forEach((m) => {
            this.app.use(m);
        });
    }

    public addMiddleware(middleware: any) {
        this.app.use(middleware);
    }

    private apiRoutes(routes: Array<Router>) {
        routes.forEach((r) => {
            this.app.use(this.apiPath, r);
        });
    }

    private authRoutes(routes: Array<Router>) {
        routes.forEach((r) => {
            this.app.use(this.authPath, r);
        });
    }

    public listen() {
        const server: Server = createServer(this.app);
        server.listen(this.port);

        server.on("error", this.onError);
        server.on("listening", () => this.onListening(server));
    }

    private onListening(server: Server): void {
        const addr = server.address();
        if (!addr) return;
        const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        console.log("Listening on " + bind);
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== "listen") {
            throw error;
        }

        const bind = typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port;

        // handle specific liseners
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
            process.exit(1);
            break;
            default:
                throw error;
        }

    }
    
    private normalizePort(val: unknown): string | number | false {
        if (typeof val === "number") {
            return val;
        }

        const port = parseInt(val as string, 10);

        if (!isNaN(port)) {
            // named pipe
            return port;
        }

        return false;
    }
}
