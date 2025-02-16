import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { db } from '../database/db';
import config from '../modules/dots';

//Middleware that requires a valid token to continue. Saves the user id in res.locals.u_id
export async function getDataOfToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'] as string;

    if(token == null || undefined) {
        res.status(401).send({ message: 'No token provided.' });
        return;
    }

    try {
        const tokenData = jwt.verify(token, config.JWT_SECRET as Secret) as { u_id: number };

        const data = await db('Users')
            .select(1)
            .where('u_id', tokenData.u_id)
            .first();
        if(data == null) {
            res.status(404).send({ message: 'User not found.' });
            return;
        } else {
            res.locals.u_id = tokenData.u_id;
            next();
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
        return;
    }
}

//Middleware that will parse a valid token if it's available. Saves the user id in res.locals.u_id
export async function getDataOfTokenIfAvailable(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'] as string;

    if(token == null || undefined) {
        next();
        return;
    }

    try {
        const tokenData = jwt.verify(token, config.JWT_SECRET as Secret) as { u_id: number };

        const data = await db('Users')
            .select(1)
            .where('u_id', tokenData.u_id)
            .first();
        if(data == null) {
            next();
            return;
        } else {
            res.locals.u_id = tokenData.u_id;
            next();
        }
    } catch (error) {
        next();
        return;
    }
}