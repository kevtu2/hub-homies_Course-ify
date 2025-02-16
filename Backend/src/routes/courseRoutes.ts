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

// Interface used for inserting Course into db
//@ts-ignore
interface Course {
    title: string;
    subject: string;
    link: string;
    u_id: string;
}

// ChatGPT prompt
const prompt = `You will receive a body of text which is the transcription of an educational video. You will summarize and condense key concepts into different sections based on the course name and the transcription. DO NOT provide more than 10 sections. You will also provide 5 comprehensive multiple-choice questions and answers (THE "answer" FIELD MUST CORRESSPOND TO THE LETTER OF THE CORRECT OPTION) based on the concepts in the transcription for each topic. The field "course_summary" means the "discipline" it is in. For example, the course "CS50" has "course_subject" be "Computer Science". You must format your output as a JSON file like so:

(EXAMPLE)
{
    "course_name": "COURSE_NAME",
    "course_subject": "COURSE_SUBJECT",
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
        //@ts-ignore
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
            const courseJson = completion.choices[0].message.content;
            if (courseJson != null) {
                JSON.parse(courseJson);
            }
            // Upload course details to db
            // try {
            //     const course: Course = {
            //         title: title,
            //         subject: completion.choices[0].message.
            //     }
            //     const data = await db('Courses')
            //     .insert()
            // }
            
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

router.get('/courses/:id', async (req, res) => {
    try {
        const data = await db('Courses')
            .select('*')
            .where('id', req.params.id)
            .leftJoin('Sections', 'Courses.id', 'Sections.c2_id')
            .first();
        
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error.' });
    }
});

export default router;