import * as express from "express";
import { statSync, writeFileSync, existsSync, readFileSync, unlinkSync, renameSync } from "fs";
import * as mkdirp from "mkdirp";
import { ncp } from "ncp";
import * as rimraf from 'rimraf';
import connection from "../../connection";
import * as crypto from "crypto";

import { getUserPath, getFiles } from '../../helper/path-helper';

import { IFile } from "../../types";

import { JAVA_PATH, C_PATH } from "../../boilerplate";


const getProjects = async function(req: express.Request, res: express.Response) {
    const { user } = req.user;
    const problem_id = req.query.problem_id;

    try {
        if(!problem_id) {
            const [rows] = await connection.execute("SELECT * FROM projects where user = ? AND enabled = true", [user.id]);
            res.json(rows);
        } else {
            const [rows] = await connection.execute("SELECT * FROM projects where user = ? AND enabled = true AND problem = ?", 
                [user.id, problem_id]);
            res.json(rows);
        }

    } catch (e) {
        res.status(400).send();
    }
    
}

const postProjects = async function(req: express.Request, res: express.Response) {
    const { name, category, problem } = req.body;
    const { user } = req.user;
    if(!name || !category) { res.status(400).send(); return; }
    
    const path = crypto.createHash("md5").update(new Date().toString()).digest("hex").substring(0, 40);

    try {
        const userpath = getUserPath({...user, path})

        mkdirp.sync(userpath, {recursive: true});
        
        switch(category) {
            case "java":
                ncp.ncp(JAVA_PATH, userpath);
                break;
            case "c":
                ncp.ncp(C_PATH, userpath);
                break;
            default:
                break;
        }

        let result = null;
        if(!problem) {
            result = await connection.execute("INSERT INTO projects(name, category, user, path) VALUES (?, ?, ?, ?)", [name, category, user.id, path]);
        } else {
            result = await connection.execute("INSERT INTO projects(name, category, user, path, problem) VALUES (?, ?, ?, ?, ?)", 
                [name, category, user.id, path, problem]);
        }

        res.status(200).send({id: result[0].insertId});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const getProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }


    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no data"); return; }
        const result = rows[0];

        const path = getUserPath({...user, ...result});
        const files: Array<IFile> = getFiles(path, { data: true });

        res.status(200).send({
            ...result,
            files
        });
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const postProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    const { filename, data, path, isDirectory } = req.body;
    if(!id) { res.status(400).send({code: 0, msg:"id is not integer"}); return; }
    if(!filename) { res.status(400).send({code: 1, msg:"no filename"}); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send({code: 2, msg: "no project data"}); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _filename = `${userpath}${path ? "/" + path : ""}/${filename}`;

        if(existsSync(_filename)) {
            res.status(400).send({code: 3, msg: "file is exists"});
            return;
        } 

        if(isDirectory) {
            mkdirp.sync(_filename);
        } else {
            console.log(_filename);
            writeFileSync(_filename, data);
        }

        res.status(200).send({});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const putProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    const { name, category, enabled } = req.body;
    if(!id) { res.status(400).send("id is not integer"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0]
        
        const _name = name ? name : result.name;
        const _category = category ? category : result.category;

        await connection.execute("UPDATE projects SET name = ?, category = ? WHERE id = ?", [_name, _category, id]);

        res.status(200).send({});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const deleteProject = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ?", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0]

        await connection.execute("UPDATE projects SET enabled = 0 WHERE id = ?", [id]);

        res.status(200).send({});
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const getProjectFile = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const path = req.params[0];

    const { user } = req.user;
    if(!id) { res.status(400).send("id is not integer"); return; }
    if(!path) { res.status(400).send("no file path"); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send("no project data"); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _path = `${userpath}/${path}`;

        if(!existsSync(_path)) {
            res.status(400).send("no file");
            return;
        }

        const state = statSync(_path);
        const isDirectory = state.isDirectory();
        const name = _path.substring(_path.lastIndexOf("/") + 1);

        const file: IFile = {name, isDirectory, path}
        
        if(isDirectory) {
            file.files = getFiles(_path);
        } else {
            const filebuffer = readFileSync(_path);
            file.data = filebuffer.toString('utf8');
        }
        
        res.status(200).send(file);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const putProjectFile = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const path = req.params[0];
    const { data, name } = req.body;

    const { user } = req.user;
    if(!id) { res.status(400).send({code: 0, msg: "id is not integer"}); return; }
    if(!path) { res.status(400).send({code: 1, msg: "no file path"}); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send({code:2, msg: "no project data"}); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _path = `${userpath}/${path}`;
        

        if(!existsSync(_path)) {
            res.status(400).send({code:3, msg: "no file"});
            return;
        }
        const state = statSync(_path);
        const isDirectory = state.isDirectory();
        
        if(!isDirectory && data) {
            writeFileSync(_path, data);
        }

        if(name) {
            const directoryPath = _path.substring(0, _path.lastIndexOf("/"));
            const newName = `${directoryPath}/${name}`;
            if(existsSync(newName)) {
                res.status(400).send({code:4, msg: "file exisist"});
                return;
            }
            renameSync(_path, newName);
        }

        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

const deleteProjectFile = async function(req: express.Request, res: express.Response) {
    const id = parseInt(req.params.id, 10);
    const path = req.params[0];

    const { user } = req.user;
    if(!id) { res.status(400).send({code:0 , msg: "id is not integer"}); return; }
    if(!path) { res.status(400).send({code: 1, msg: "no file path"}); return; }

    try {
        const [rows] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user = ? AND enabled = true", [id, user.id]);
        if(rows.length != 1) { res.status(400).send({code: 2, msg: "no project data"}); return; }
        const result = rows[0];

        const userpath = getUserPath({...user, ...result});
        const _path = `${userpath}/${path}`;

        if(!existsSync(_path)) {
            res.status(400).send({code: 3, msg: "no file"});
            return;
        }

        const state = statSync(_path);
        const isDirectory = state.isDirectory();
        
        if(isDirectory) {
            rimraf.sync(_path);
        } else {
            unlinkSync(_path);
        }

        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

export const ProjectsEndPoint = {
    getProjects,
    postProjects,
    getProject,
    postProject,
    putProject,
    deleteProject,
    getProjectFile,
    putProjectFile,
    deleteProjectFile
}