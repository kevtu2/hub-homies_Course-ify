import { Router } from 'express';
import cors from 'cors';
// import OpenAI from "openai";
// import { db } from '../database/db';

import Transcriptor from 'youtube-video-transcript';


const router = Router();

router.options('/course', cors({ origin: '*' }));  // Preflight support

interface DataItem {
    start: number;
    duration: number;
    text: string;
}

// Takes a transcript of a given youtube video and generates a course from it. 
router.post('/course', async (req, res) => {
    try {
        const title = req.body.title;
        const link = req.body.link; 
        var transcription;
        // Obtain transcription from youtube video
        // Transcriptor.getTranscript('https://www.youtube.com/watch?v=JBm0Tz4wDqU')
        Transcriptor.getTranscript(link)
        .then((transcript: any) => {
            transcription = (transcript.data as DataItem[]).map((item) => item.text).join(' ');
            console.log(transcription);
        })
        .catch((err: any) => {
            console.error('Error fetching transcript:', err);
        });

        //
        
        res.status(200).send({ message : "Course successfully generated." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : "Failed to generate course." });
    }
});

export default router;