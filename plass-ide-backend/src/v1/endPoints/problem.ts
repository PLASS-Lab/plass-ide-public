import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import {IProblem} from "../../types";

const javaDirectory = path.join(__dirname, "../../../problems/java");
const csharpDirectory = path.join(__dirname, "../../../problems/csharp");
const problemDirectory = path.join(__dirname, "../../../problems/problem");

const getProblems = (req: express.Request, res: express.Response) => {
    const problems = fs.readdirSync(javaDirectory).filter(file => !file.includes("in") && !file.includes("out"));

    res
        .status(200)
        .json({
            problems,
        });
};

const getProblem = (req: express.Request, res: express.Response) => {
    const label = req.params.label;
    fs.readFileSync(path.join(javaDirectory, label), {encoding: "utf-8"});

    if (!fs.existsSync(path.join(javaDirectory, label))) {
        res
            .status(404)
            .end();
        return;
    }

    const fileContent = fs.readFileSync(path.join(javaDirectory, label), {encoding: "utf-8"});

    const problem: IProblem = {
        number: label,
        type: fileContent[0],
        question: fileContent[0] === "A" ? /Q\.\n((.*\n)*.*)/.exec(fileContent)[1] : /Q\.\n((.*\n)*)A\.\n/.exec(fileContent)[1],
        answer: fileContent[0] === "A" ? "" : /A\.\n((.*\n)*.*)/.exec(fileContent)[1],
    };

    res
        .status(200)
        .json(problem);
};

export const problemEndPoint = {
    getProblems,
    getProblem,
};
