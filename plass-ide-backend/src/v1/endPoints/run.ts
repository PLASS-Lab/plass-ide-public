import {ChildProcess, spawn} from "child_process";
import * as crypto from "crypto";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";

const dockerInstance: {
    [key: string]: IDockerInstance;
} = {};

interface IDockerInstance {
    process: ChildProcess;
    stdout: IDockerOutput[];
    stderr: IDockerOutput[];
}

interface IDockerOutput {
    data: string;
    index: number;
    closed: boolean;
}

const run = (req: express.Request, res: express.Response) => {
    const sourcePath = path.join(__dirname, `../../../files/${req.user.userId}`);

    if (!fs.existsSync(sourcePath)) {
        fs.mkdirSync(sourcePath);
    }

    fs.writeFileSync(path.join(sourcePath, "Main.java"), req.body.source);

    const hash = crypto.createHmac("sha256", "")
        .update(req.body.source)
        .digest("hex");

    const docker = spawn("docker", ["run", "--rm", "-v", `${sourcePath}:/src`, "java-build:1.0"]);

    res
        .status(201)
        .json({
            hash,
        });

    dockerInstance[hash] = {
        process: docker,
        stdout: [],
        stderr: [],
    };

    docker.stdout.on("data", (data) => {
        dockerInstance[hash]
            .stdout
            .push({
                data: data.toString(),
                index: dockerInstance[hash].stdout.length,
                closed: false,
            });
    });

    docker.stdout.on("end", () => {
        dockerInstance[hash]
            .stdout
            .push({
                data: "",
                index: dockerInstance[hash].stdout.length,
                closed: true,
            });
    });

    docker.stderr.on("data", (data) => {
        dockerInstance[hash]
            .stderr
            .push({
                data: data.toString(),
                index: dockerInstance[hash].stderr.length,
                closed: false,
            });
    });

    docker.stderr.on("end", () => {
        if (dockerInstance[hash].stderr.length === 0) {
            return;
        }

        dockerInstance[hash]
            .stderr
            .push({
                data: "",
                index: dockerInstance[hash].stderr.length,
                closed: true,
            });
    });
};

const result = async (req: express.Request, res: express.Response) => {
    const hash = req.params.hash;
    const isError = JSON.parse(req.query.is_error);
    let index = req.query.index ? parseInt(req.query.index, 10) : -1;

    if (!dockerInstance[hash]) {
        res
            .status(404)
            .end();
        return;
    }

    while (!((isError && dockerInstance[hash].stderr[index + 1]) ||
        (!isError && dockerInstance[hash].stderr.length > 0) ||
        (!isError && dockerInstance[hash].stdout[index + 1]))) {
        await new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    if (!isError && dockerInstance[hash].stderr.length > 0) {
        index = -1;
    }

    if (dockerInstance[hash].stderr.length > 0) {
        res
            .status(200)
            .json({
                err: true,
                data: dockerInstance[hash].stderr[index + 1].data,
                index: index + 1,
                closed: dockerInstance[hash].stderr[index + 1].closed,
            });
    } else {
        console.log(index + 1, dockerInstance[hash].stdout[index + 1]);
        res
            .status(200)
            .json({
                err: false,
                data: dockerInstance[hash].stdout[index + 1].data,
                index: index + 1,
                closed: dockerInstance[hash].stdout[index + 1].closed,
            });
    }
};

export const runEndPoint = {
    run,
    result,
};
