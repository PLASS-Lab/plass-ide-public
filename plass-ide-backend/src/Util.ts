import * as express from "express";

export const checkFileNameValid = (fileName: string): boolean => {
    return /^[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/.test(fileName);
};

export const getTokenFromRequestCookie = (req: express.Request) => {
    return req && req.cookies && req.cookies.token || undefined;
};
