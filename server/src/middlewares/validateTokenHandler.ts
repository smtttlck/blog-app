import jwt from "jsonwebtoken";
import { Handler } from "express";

const validateTokenHandler: Handler = async (req, res, next) => { // authorization
    let token: string | undefined;
    const autHeader: string = req.headers.authorization as string;
    if(autHeader && autHeader.startsWith('Bearer')) { // check authorization
        token = autHeader.split(" ")[1];
        jwt.verify(token, process.env.USER_TOKEN_SECRET as string, (err, decode) => { // check token
            if(err) {
                res.status(401);
                throw new Error("User is not authorizated");
            }
            req.user = decode as jwt.JwtPayload;
            next();
        })
    }
    if(!token) {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }
}

export default validateTokenHandler;