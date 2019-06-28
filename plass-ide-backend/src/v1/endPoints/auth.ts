import * as bcrypt from "bcrypt";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import {auth} from "../../auth";
import {IUser} from "../../types";

const userPath = path.join(__dirname, "../../../users.json");

const readUsers = (): IUser[] => {
    if (!fs.existsSync(userPath)) {
        fs.writeFileSync(userPath, "[{\"name\": \"test\",\"pw\": \"$2b$10$.2DgK45g7ov3Fa51OxozZe3gu4MDMieRIc7rGxKIf8b3tgxjBsm0i\"}]");
    }

    return JSON.parse(fs.readFileSync(userPath, {encoding: "UTF-8"}));
};

const signin = (req: express.Request, res: express.Response) => {
    if (req.body.userId === undefined || req.body.userPw === undefined) {
        res
            .status(400)
            .end();
        return;
    }

    const users = readUsers();

    if (users.some(value => req.body.userId === value.name && bcrypt.compareSync(req.body.userPw, value.pw))) {
        const token = auth.signToken({
            userId: req.body.userId,
        });

        res
            .cookie("token", token)
            .status(200)
            .end();
        return;
    } else {
        res
            .status(403)
            .end();
        return;
    }
};

const signout = (req: express.Request, res: express.Response) => {
    res
        .clearCookie("token")
        .set("location", "/")
        .status(302)
        .end();
};

const verify = (req: express.Request, res: express.Response) => {
    res
        .status(200)
        .end();
};

export const authEndPoint = {
    signin,
    signout,
    verify,
};
