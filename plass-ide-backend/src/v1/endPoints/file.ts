import * as express from "express";
import {existsSync, lstatSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync} from "fs";
import {join} from "path";
import {checkFileNameValid} from "../../Util";
import {IDirectoryNodes} from "../interface";

// 파일 저장 디렉토리
const fileDir = join(__dirname, "../../../files");

// 파일/폴더 구조를 재귀적으로 확인
let id = 1;

const readDirRecursive = (root: string) => {
    const nodes: IDirectoryNodes[] = [];

    readdirSync(root)
        .forEach(name => {
            nodes.push({
                id: 0,
                label: name,
                isDirectory: false,
                childNodes: [],
            });
        });

    nodes
        .filter(node => lstatSync(join(root, node.label)).isDirectory())
        .forEach(node => {
            node.icon = "folder-open";
            node.hasCaret = true;
            node.isExpanded = false;
            node.isDirectory = true;
        });

    nodes
        .filter(node => !lstatSync(join(root, node.label)).isDirectory())
        .forEach(node => {
            node.icon = "code";
            node.hasCaret = false;
        });

    nodes.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) {
            return -1;
        } else if (!a.isDirectory && b.isDirectory) {
            return 1;
        } else {
            return a.label.localeCompare(b.label);
        }
    });

    nodes
        .forEach(node => {
            node.id = id++;
        });

    nodes
        .filter(node => lstatSync(join(root, node.label)).isDirectory())
        .forEach(node => {
            node.childNodes = readDirRecursive(join(root, node.label));
        });

    return nodes;
};

const getFileNames = (req: express.Request, res: express.Response) => {
    // 모든 파일 이름들 확인
    id = 1;
    const rootItems = readDirRecursive(fileDir);

    res
        .status(200)
        .json({
            root: rootItems,
        });
};

const getFile = (req: express.Request, res: express.Response) => {
    const requestedFilePath = decodeURI(req.path.substring("/files/".length));

    // 파일 이름 확인
    if (!requestedFilePath
        .split("/")
        .map(checkFileNameValid)
        .reduce((previousValue, currentValue) => previousValue && currentValue)) {
        res
            .status(400)

            .end();

        return;
    }

    // 파일 경로
    const filePath = join(fileDir, `/${requestedFilePath}`);

    // 파일이 있는지 확인
    if (!existsSync(filePath)) {
        res
            .status(404)
            .end();

        return;
    }

    // 파일 내용 전송
    res
        .status(200)
        .contentType("text/plain")
        .send(readFileSync(filePath, {encoding: "utf-8"}));
};

const postFile = (req: express.Request, res: express.Response) => {
    /**
     * request body 필수 변수들 확인
     *
     * fileName: string
     * fileContent: string
     */
    if (req.body.fileName === undefined ||
        typeof req.body.fileName !== "string" ||
        req.body.fileContent === undefined ||
        typeof req.body.fileContent !== "string") {
        res
            .status(400)
            .end();

        return;
    }

    const requestedFilePath = decodeURI(req.body.fileName);

    // 파일 이름 확인
    if (!requestedFilePath
        .split("/")
        .map(checkFileNameValid)
        .reduce((previousValue, currentValue) => previousValue && currentValue)) {
        res
            .status(400)
            .end();

        return;
    }

    // 파일 경로
    const filePath = join(fileDir, `/${requestedFilePath}`);

    // 파일이 이미 존재하는지 확인
    if (existsSync(filePath)) {
        res
            .status(409)
            .end();

        return;
    }

    writeFileSync(filePath, req.body.fileContent);

    res
        .status(201)
        .end();
};

const putFile = (req: express.Request, res: express.Response) => {
    /**
     * request body 필수 변수들 확인
     *
     * fileContent: string
     */
    if (req.body.fileContent === undefined ||
        typeof req.body.fileContent !== "string") {
        res
            .status(400)
            .end();

        return;
    }

    const requestedFilePath = decodeURI(req.path.substring("/files/".length));

    // 파일 이름 확인
    if (!requestedFilePath
        .split("/")
        .map(checkFileNameValid)
        .reduce((previousValue, currentValue) => previousValue && currentValue)) {
        res
            .status(400)
            .end();

        return;
    }

    // 파일 경로
    const filePath = join(fileDir, `/${requestedFilePath}`);

    // 파일이 있는지 확인
    if (!existsSync(filePath)) {
        res
            .status(404)
            .end();
    }

    writeFileSync(filePath, req.body.fileContent);

    res
        .status(201)
        .end();
};

const deleteFile = (req: express.Request, res: express.Response) => {
    const requestedFilePath = decodeURI(req.path.substring("/files/".length));

    // 파일 이름 확인
    if (!requestedFilePath
        .split("/")
        .map(checkFileNameValid)
        .reduce((previousValue, currentValue) => previousValue && currentValue)) {
        res
            .status(400)
            .end();

        return;
    }

    // 파일 경로
    const filePath = join(fileDir, `/${requestedFilePath}`);

    // 파일이 있는지 확인
    if (existsSync(filePath)) {
        unlinkSync(filePath);
    }

    res
        .status(204)
        .end();
};

const renameFile = (req: express.Request, res: express.Response) => {
    /**
     * request body 필수 변수들 확인
     *
     * filePath: string
     * newFilePath: string
     */
    if (req.body.filePath === undefined ||
        typeof req.body.filePath !== "string" ||
        req.body.newFilePath === undefined ||
        typeof req.body.newFilePath !== "string") {
        res
            .status(400)
            .end();

        return;
    }

    const requestedFilePath = decodeURI(req.body.filePath);
    const requestedNewFilePath = decodeURI(req.body.newFilePath);

    // 파일 이름 확인
    if (!requestedFilePath
            .split("/")
            .map(checkFileNameValid)
            .reduce((previousValue, currentValue) => previousValue && currentValue) ||
        !requestedNewFilePath
            .split("/")
            .map(checkFileNameValid)
            .reduce((previousValue, currentValue) => previousValue && currentValue)) {
        res
            .status(400)
            .end();

        return;
    }

    // 파일 경로
    const filePath = join(fileDir, `/${requestedFilePath}`);
    const newFilePath = join(fileDir, `/${requestedNewFilePath}`);

    // 기존 파일이 있는지 확인
    if (!existsSync(filePath)) {
        res
            .status(404)
            .end();

        return;
    }

    // 새 파일 이름이 있는지 확인
    if (existsSync(newFilePath)) {
        res
            .status(409)
            .end();

        return;
    }

    renameSync(filePath, newFilePath);

    res
        .status(201)
        .end();
};

export const fileEndPoint = {
    getFileNames,
    getFile,
    postFile,
    putFile,
    deleteFile,
    renameFile,
};
