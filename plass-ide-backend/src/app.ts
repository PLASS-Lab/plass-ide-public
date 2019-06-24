import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import {logger} from "./logger";

import {auth} from "./auth";
import {router} from "./v1/router";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();
const server = http.createServer(app);

// config middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan(logger));
app.use(auth.initialize());

// config router
app.use("/api", router);

server.listen(port, () => {
    console.log("server is listening on port " + port);
});
