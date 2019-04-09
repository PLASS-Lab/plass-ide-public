import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as morgan from "morgan";
import {logger} from "../logger";
import {authenticate} from "./auth";
import {authEndPoint, fileEndPoint, problemEndPoint, runEndPoint} from "./endPoints";

const router = express.Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(morgan(logger));

router.get("/signout", authEndPoint.signout);

router.get("/verify", authenticate, authEndPoint.verify);

router.post("/signin", authEndPoint.signin);

router.get("/files", authenticate, fileEndPoint.getFileNames);

router.get("/files/*", authenticate, fileEndPoint.getFile);

router.post("/files", authenticate, fileEndPoint.postFile);

router.put("/files/*", authenticate, fileEndPoint.putFile);

router.delete("/files/*", authenticate, fileEndPoint.deleteFile);

router.post("/rename", authenticate, fileEndPoint.renameFile);

router.post("/run", authenticate, runEndPoint.run);

router.get("/run/result/:hash", authenticate, runEndPoint.result);

router.get("/problems/java", authenticate, problemEndPoint.getProblems);

router.get("/problems/java/:label", authenticate, problemEndPoint.getProblem);

export {router};
