import { Router } from 'express';
import { db } from '../database/db';

const router = Router();


// Takes a transcript of a given youtube video and generates a course from it. 
router.post('/course', async (req, res) => {
    try {
        const title = req.body.title;
        const link = req.body.link;
        res.status(200).send({ message : "Course successfully generated." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : "Failed to generate course." });
    }
});