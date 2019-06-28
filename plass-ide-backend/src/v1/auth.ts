import * as express from "express";
import * as passport from "passport";
import {Strategy} from "passport-jwt";
import {getTokenFromRequestCookie} from "../Util";

const passportOption = {
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: getTokenFromRequestCookie,
};

passport.use("jwt", new Strategy(
    passportOption,
    (payload, next) => {
        if (payload.userId) {
            return next(null, {
                userId: payload.userId,
            });
        } else {
            return next(null, false);
        }
    },
));

export const authenticate = (req: express.Request, res: express.Response, next) => {
    return passport.authenticate(["jwt"], {session: false})(req, res, next);
};
