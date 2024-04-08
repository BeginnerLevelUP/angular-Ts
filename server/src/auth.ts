import * as jwt from "jsonwebtoken"
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'; // Import the necessary types

interface ExtendedRequest extends Request {
    user?: any;
}

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

const authMiddleware = function (req: ExtendedRequest, res: Response, next: NextFunction) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
    }

    if (!token) {
        return next();
    }

    try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration }) as JwtPayload;
        req.user = data;
    } catch {
        console.log('Invalid token');
    }

    next();
};

const signToken = function ({ email, username, _id }: { email: string, username: string, _id: string }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

export default {
    authMiddleware,
    signToken,
};
