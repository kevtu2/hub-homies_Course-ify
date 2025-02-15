import { Router } from 'express';
import cors from 'cors';
// import { db } from '../database/db';

import Transcriptor from 'youtube-video-transcript';


const router = Router();

router.options('/course', cors({ origin: '*' }));  // Preflight support

// Takes a transcript of a given youtube video and generates a course from it. 
router.post('/course', async (req, res) => {
    try {
        // const title = req.body.title;
        // const link = req.body.link;
        await Transcriptor.getTranscript('https://www.youtube.com/watch?v=ZcpwnozMh2U', ['en']).then(console.log);
        res.status(200).send({ message : "Course successfully generated." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : "Failed to generate course." });
    }
});

export default router;