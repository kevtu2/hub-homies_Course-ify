import { Router } from 'express';
import { db } from '../database/db';
import config from '../modules/dots';
import jwt, { Secret } from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = config.JWT_SECRET

router.post('/auth/login', async (req, res) => {
router.post('/auth/login', async (req, res) => {
    try {
        const user = await db('Users')
            .select('u_id', 'name')
            .where('email', req.body.email)
            .where('pwd', req.body.pwd).first();
        const token = jwt.sign({ u_id: user.u_id }, JWT_SECRET as Secret, { expiresIn: '7d' });

        const outputData = {
            token: token,
            name: user.name,
            u_id: user.u_id
        }
        const outputData = {
            token: token,
            name: user.name,
            u_id: user.u_id
        }

        res.status(200).send(outputData)
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' })
    }
});

router.post('/auth/tokenLogin', async (req, res) => {
router.post('/auth/tokenLogin', async (req, res) => {
    try {
        const tokenData = jwt.verify(req.body.token, JWT_SECRET as Secret) as { u_id: number };
        
        const user = await db('Users')
            .select('u_id', 'name')
            .where('u_id', tokenData.u_id)
            .first();

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const newToken = jwt.sign({ u_id: user.u_id }, JWT_SECRET as Secret, { expiresIn: '7d' });

        const outputData = {
            token: newToken,
            name: user.name,
            u_id: user.u_id
        };
        const tokenData = jwt.verify(req.body.token, JWT_SECRET as Secret) as { u_id: number };
        
        const user = await db('Users')
            .select('u_id', 'name')
            .where('u_id', tokenData.u_id)
            .first();

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const newToken = jwt.sign({ u_id: user.u_id }, JWT_SECRET as Secret, { expiresIn: '7d' });

        const outputData = {
            token: newToken,
            name: user.name,
            u_id: user.u_id
        };

        res.status(200).send(outputData);
        res.status(200).send(outputData);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' })
    }
})

router.post('/auth/createAccount', async (req, res) => {
router.post('/auth/createAccount', async (req, res) => {
    try {
        console.log(req.body)
        const { email, username , pwd } = req.body;

        if (!username || !email || !pwd) {
            return res.status(400).send({ message: 'Missing required fields.' });
        }

        const existingUser = await db('Users').where('email', email).first();
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists.' });
        }

        await db('Users').insert({ username, email, pwd });

        const user = await db('Users')
            .select('u_id', 'name')
            .where('email', email)
            .first();

        if (!user) {
            return res.status(500).send({ message: 'Failed to create user.' });
        }
        console.log(req.body)
        const { email, username , pwd } = req.body;

        if (!username || !email || !pwd) {
            return res.status(400).send({ message: 'Missing required fields.' });
        }

        const existingUser = await db('Users').where('email', email).first();
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists.' });
        }

        await db('Users').insert({ username, email, pwd });

        const user = await db('Users')
            .select('u_id', 'name')
            .where('email', email)
            .first();

        if (!user) {
            return res.status(500).send({ message: 'Failed to create user.' });
        }

        const token = jwt.sign({ u_id: user.u_id }, JWT_SECRET as Secret, { expiresIn: '7d' });

        const outputData = {
            token: token,
            name: user.name,
            u_id: user.u_id
        };
        const token = jwt.sign({ u_id: user.u_id }, JWT_SECRET as Secret, { expiresIn: '7d' });

        const outputData = {
            token: token,
            name: user.name,
            u_id: user.u_id
        };

        res.status(200).send(outputData);
        res.status(200).send(outputData);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' })
    }
})

export default router;
