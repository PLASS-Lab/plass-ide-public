import * as express from "express";
import {authenticate} from "./auth";
import {authEndPoint, problemEndPoint, runEndPoint} from "./endPoints";
import { ProjectsEndPoint } from "./endPoints/projects";

const router = express.Router();

router.get("/signout", authEndPoint.signout);

router.get("/verify", authenticate, authEndPoint.verify);

router.post("/signin", authEndPoint.signin);

router.get("/problems", problemEndPoint.getProblems);

router.get("/problems/:id", problemEndPoint.getProblem);

router.get("/projects", authenticate, ProjectsEndPoint.getProjects);
router.post("/projects", authenticate, ProjectsEndPoint.postProjects);

router.get("/projects/:id", authenticate, ProjectsEndPoint.getProject);
router.post("/projects/:id", authenticate, ProjectsEndPoint.postProject);
router.put("/projects/:id", authenticate, ProjectsEndPoint.putProject);
router.delete("/projects/:id", authenticate, ProjectsEndPoint.deleteProject);

/**
 * use * for params with slash 
 * index 0 is a file name
 */
router.get("/projects/:id/*", authenticate, ProjectsEndPoint.getProjectFile);
router.put("/projects/:id/*", authenticate, ProjectsEndPoint.putProjectFile);
router.delete("/projects/:id/*", authenticate, ProjectsEndPoint.deleteProjectFile);

/**
 * run
 */

router.post("/run/projects/:id", authenticate, runEndPoint.run);
router.put("/run/:hash", authenticate, runEndPoint.input);
router.get("/run/:hash", authenticate, runEndPoint.result);
router.post("/submit/projects/:id", authenticate, runEndPoint.submit);

export {router};
