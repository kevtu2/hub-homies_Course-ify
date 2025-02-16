import { Router } from 'express';
import { db } from '../database/db';
import cors from 'cors';
import OpenAI from "openai";
import config from "../modules/dots";

// import { db } from '../database/db';

// import Transcriptor from 'youtube-video-transcript';

import { YoutubeTranscript } from 'youtube-transcript';

const router = Router();
const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

router.options('/course', cors({ origin: '*' }));  // Preflight support

// Interface for Transcriptor
interface DataItem {
    text: string;
    duration: number;
    offset: number;
    lang: string;
}

// ChatGPT prompt
const prompt = `You will receive a body of text which is the transcription of an educational video. You will summarize and condense key concepts into different sections based on the course name and the transcription. DO NOT provide more than 10 sections. You will also provide 5 comprehensive multiple-choice questions and answers (CORRESPONDING TO THE LETTER OF CORRECT ANSWER) based on the concepts in the transcription for each topic. You must format your output as a JSON file like so:

(EXAMPLE)
{
    "course_name": "COURSE_NAME",
    "course_summary": "COURSE_SUMMARY",
    "sections": [
        {
            "section": "SECTION_NAME",
            "summary": "SECTION_SUMMARY",
            "questions" : [
                "q1" : [
                    "question" : "QUESTION",
                    "answer" : "ANSWER"
                    "a" : "OPTION1",
                    "b" : "OPTION2",
                    "c" : "OPTION3",
                    "d" : "OPTION4"
                ]
                // ** UP TO q5 ** //
            ]
        }
    ],
}
DO NOT ADD ANY NEW LINE CHARACTERS OR ANY ADDITIONAL CHARACTERS.
NOTE THAT each course has multiple topics in "topics".
`;

// Takes a transcript of a given youtube video and generates a course from it. 
router.post('/course', async (req, res) => {
    try {
        const title = req.body.title;
        const link = req.body.link; 
        var transcription;

        // Obtain transcription from youtube video
        const result = await YoutubeTranscript.fetchTranscript(link);
        if (result != null) {
            transcription = (result as DataItem[]).map((item) => item.text).join(' ');
        } else {
            const failure = "Failed to retrieve transcription for the video."
            console.log(failure);
            res.status(500).send({ message: failure});
            return;
        }

        // Query ChatGPT 4o-mini
        if (transcription != null) {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: prompt },
                    { 
                        role: "user",
                        content: transcription,
                    },
                ],
                store: false,
            });
            
            console.log(completion.choices[0].message);
            // Send the course details
            res.status(200).send({ 
                title: title,
                course: completion.choices[0].message
            });
        } else {
            const failure = "Failed to retrieve transcription for the video."
            console.log(failure);
            res.status(500).send({ message: failure});
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message : "Failed to generate course." });
    }
});

router.get('/getCourses', async (req, res) => {
    //const token = req.headers['authorization'];
    
});

router.get('/courses/:c_id', async (req, res) => {
    try {
        const data = await db('Courses as c')
            .select('c.*', 's.*', 'q.*')
            .leftJoin('sections as s', 'c.s_id', '=', 's.s_id')
            .leftJoin('questions as q', 's.s_id', '=', 'q.s_id')
            .where('c.c_id', Number(req.params.c_id))
            .first();
        
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

export default router;