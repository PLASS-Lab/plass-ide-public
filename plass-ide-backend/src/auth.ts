import * as jwt from "jsonwebtoken";
import * as passport from "passport";

export const auth = {
    initialize: () => {
        return passport.initialize();
    },
    signToken: (payload) => {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
    },
};
