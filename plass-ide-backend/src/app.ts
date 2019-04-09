import * as express from "express";
import * as http from "http";
import {auth} from "./auth";
import {router} from "./v1/router";

if (process.env.PORT === undefined) {
    console.error("PORT is not defined.");
    process.exit();
}

const port = parseInt(process.env.PORT, 10);

const app = express();

const server = http.createServer(app);

app.use(auth.initialize());

app.use("/api", router);

server.listen(port, () => {
    console.log("server is listening on port " + port);
});
