/*
import { Router } from 'express';
import { db } from '../database/db';
import config from '../modules/dots';
import jwt, { Secret } from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = config.JWT_SECRET

router.post('/login', async (req, res) => {
    try {
        //Check if the email, password combination is valid
        
        //Get the username, u_id for the id corresponding to the id
        const token = jwt.sign({ u_id: 1 }, JWT_SECRET as Secret, { expiresIn: '7d' });

        const outputData = {}

        res.status(200).send(outputData)
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' })
    }
});

router.post('/tokenLogin', async (req, res) => {
    try {
        const tokenData = jwt.verify(req.body.token, JWT_SECRET as Secret);

        //Get the username, u_id for the id corresponding to tokenData.u_id
        
        const outputData = {}

        res.status(200).send(outputData)
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' })
    }
})

router.post('/createAccount', async (req, res) => {
    try {

        const outputData = {}

        const token = jwt.sign({ u_id: 1 }, JWT_SECRET as Secret, { expiresIn: '7d' });

        res.status(200).send(outputData)
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' })
    }
})

export default router;
*/