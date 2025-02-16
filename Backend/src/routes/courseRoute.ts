import { Router } from 'express';
import cors from 'cors';
import OpenAI from "openai";
// import { db } from '../database/db';

import Transcriptor from 'youtube-video-transcript';


const router = Router();
const openai = new OpenAI();

router.options('/course', cors({ origin: '*' }));  // Preflight support

// Interface for Transcriptor
interface DataItem {
    start: number;
    duration: number;
    text: string;
}

// ChatGPT prompt
const prompt = `You will receive a body of text which is the transcription of an educational video. You will summarize and condense key concepts into different topics based on the course name and the transcription. DO NOT provide more than 10 topics. You will also provide 5 quiz questions based on the concepts in the transcription for each topic. You must format your output as a JSON file like so:
{
    "course_name": "COURSE_NAME",
    "course_summary": "COURSE_SUMMARY",
    "topics": [
        {
            "topic": "TOPIC_NAME",
            "summary": "TOPIC_SUMMARY",
            "questions" : [
                "QUESTION 1",
                "QUESTION 2",
                "QUESTION 3",
                "QUESTION 4",
                "QUESTION 5"
            ]
        }
    ],
}

NOTE THAT each course has multiple topics in "topics".
`;

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

        // Query ChatGPT 4o-mini
        
        res.status(200).send({ message : "Course successfully generated." });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : "Failed to generate course." });
    }
});

export default router;