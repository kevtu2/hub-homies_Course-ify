import { Router } from 'express';
import { db } from '../database/db';
import cors from 'cors';
import OpenAI from "openai";
import config from "../modules/dots";
import { getDataOfTokenIfAvailable } from '../middleware/tokenCheckerMiddleware';

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
    u_id: string;
    title: string;
    subject: string;
    link: string;
    summary :string;
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
router.post('/course', getDataOfTokenIfAvailable, async (req, res) => {
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
                response_format: { "type" : "json_object" },
                store: false,
            });

            let formatJson = completion.choices[0].message.content;
            if (formatJson != null) {
                // Remove the leading and trailing quotes
                formatJson = formatJson.replace(/^'/, '').replace(/'$/, '');

                // Remove all instances of + and the extra quotes around lines
                formatJson = formatJson.replace(/'\n' \+ ?/g, '');

                // Convert escaped newlines (\n) to real newlines
                formatJson = formatJson.replace(/\\n/g, '\n');
            }
            
            
            var courseJson;
            console.log("Parsing Json..");
            if (formatJson != null) {
                courseJson = JSON.parse(formatJson);
            }
            
            // console.log("Generating Course...");
            // console.log(courseJson.course_name);
            // console.log(courseJson.course_subject);
            // console.log(courseJson.course_summary);
            // console.log(courseJson.sections[0].section);
            // console.log(courseJson.sections[0].summary);
            // console.log(courseJson.sections[0].questions);
            // console.log("End of course.");
            
            res.status(200).send({ 
                    message: "Successfully generated the course.", 
                    u_id: res.locals.u_id,
                    link: link,
                    course: courseJson
                 });

            return;
            // // Upload course details to db
            // try {
            //     var courseContent = courseJson.content
            //     const course: Course = {
            //         u_id: res.locals.u_id,
            //         title: title,
            //         subject: courseContent.course_subject,
            //         link: link,
            //         summary: courseContent.course_summary
            //     }
            //     const [course_id] = await db('Courses').insert(course);
            //     res.status(200).send({ course_id: course_id, course: courseContent });
            // } catch (error) {
            //     const failure = "Failed to upload new course to database.";
            //     console.log(failure);
            //     console.log(error);
            //     res.status(500).send( { message: failure });
            //     return;
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
    try{
        const courses = await db('mydatabase').select('c_id').from('Courses');
        if (courses.length === 0) {
            res.status(404).send({ message: 'No courses found.' });
            return;
        }

        res.status(200).send(courses);
    }
    catch{
        console.error(Error);
        res.status(500).send({ message: 'Internal server error.' });
    }
    
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