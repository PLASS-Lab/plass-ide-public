import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import JWT_SECRET_KEY from "../config/jwt_secret_key";

export const auth = {
    initialize: () => {
        return passport.initialize();
    },
    signToken: (payload) => {
        return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "1h"});
    },
};
