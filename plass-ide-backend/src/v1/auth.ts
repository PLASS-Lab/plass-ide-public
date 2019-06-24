import * as express from "express";
import * as passport from "passport";
import {Strategy} from "passport-jwt";
import JWT_SECRET_KEY from "../../config/jwt_secret_key";
import {getTokenFromRequestCookie} from "../Util";

const passportOption = {
    secretOrKey: JWT_SECRET_KEY,
    jwtFromRequest: getTokenFromRequestCookie,
};

passport.use("jwt", new Strategy(
    passportOption,
    (payload, next) => {
        if (payload.user) {
            return next(null, { user: payload.user });
        } else {
            return next(null, false);
        }
    },
));

export const authenticate = (req: express.Request, res: express.Response, next) => {
    return passport.authenticate(["jwt"], {session: false})(req, res, next);
};
