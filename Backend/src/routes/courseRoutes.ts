import { Router } from 'express';
import { db } from '../database/db';
import cors from 'cors';
import OpenAI from 'openai';
import config from '../modules/dots';
import { getDataOfToken } from '../middleware/tokenCheckerMiddleware';
import { YoutubeTranscript } from 'youtube-transcript';
import { addCourseOutputToDatabase } from '../modules/dbAddHelper';

const router = Router();
const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

router.options('/course', cors({ origin: '*' })); // Preflight support

// Interface for Transcriptor
interface DataItem {
  text: string;
  duration: number;
  offset: number;
  lang: string;
}


// ChatGPT prompt
const prompt = `You will receive a body of text which is the transcription of an educational video. You will summarize and condense key concepts into different sections based on the course name. You MUST generate at least 300 words for the course summary and NO LESS than 150 words. DO NOT provide more than 10 sections and you MUST generate at least 300 words for each section summary and NO LESS than 150 words. You will also provide 5 comprehensive multiple-choice questions and answers (THE "answer" FIELD MUST CORRESPOND TO THE LETTER OF THE CORRECT OPTION) based on the concepts in the transcription for each topic. The field "course_summary" means the "discipline" it is in. For example, the course "CS50" has "course_subject" = "Computer Science". You must format your output as a JSON file like so:

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
router.post('/course', getDataOfToken, async (req, res) => {
  try {
    //@ts-ignore
    const title = req.body.title;
    const link = req.body.link;
    let transcription;

    // Obtain transcription from youtube video
    const result = await YoutubeTranscript.fetchTranscript(link);
    if (result != null) {
      transcription = (result as DataItem[]).map(item => item.text).join(' ');
    } else {
      const failure = 'Failed to retrieve transcription for the video.';
      console.log(failure);
      res.status(500).send({ message: failure });
      return;
    }

    // Query ChatGPT 4o-mini
    if (transcription != null) {
        console.log("Asking gpt-4o-mini..");
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompt },
          {
            role: 'user',
            content: transcription,
          },
        ],
        response_format: { type: 'json_object' },
        store: false,
      });

      
      let formatJson = completion.choices[0].message.content;
      if (formatJson != null) {
        console.log("Formatting gpt's json..");
        // Remove the leading and trailing quotes
        formatJson = formatJson.replace(/^'/, '').replace(/'$/, '');

        // Remove all instances of + and the extra quotes around lines
        formatJson = formatJson.replace(/'\n' \+ ?/g, '');

        // Convert escaped newlines (\n) to real newlines
        formatJson = formatJson.replace(/\\n/g, '\n');
      }

      let courseJson;
      console.log('Parsing Json..');
      if (formatJson != null) {
        courseJson = JSON.parse(formatJson);
      }

      console.log("Adding course to db..");

      courseJson['u_id'] = 1;
      courseJson['link'] = link;
      courseJson['course_name'] = title;

      await addCourseOutputToDatabase(courseJson);
      
      console.log("Done!");

      res.status(200).send({
        message: 'Successfully generated the course.',
        u_id: res.locals.u_id,
        link: link,
        course: courseJson,
      });

      return;

    } else {
      const failure = 'Failed to retrieve transcription for the video.';
      console.log(failure);
      res.status(500).send({ message: failure });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Failed to generate course.' });
  }
});

router.get('/courses/getIds', async (req, res) => {
  try {
    const data = await db('courses').select('title', 'c_id', 'added_date', 'subject', 'c_text');
    res.status(200).send(data);
  } catch {
    console.error(Error);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

// interface for questions
interface Question {
    question: string;
    answer: string;
    a: string;
    b: string;
    c: string;
    d: string;
}

//interface for sections
interface Section {
    section: string;
    summary: string;
    questions: Question[]
}

// interface for courses
interface Course {
    course_name: string;
    course_subject: string;
    course_summary: string;
    sections: Section[],
    link: string,
    date: string
}

router.get('/courses/:c_id', async (req, res) => {
  try {
    const courseData = await db('courses as c')
        .select('c.title', 'c.subject', 'c.c_text', 'c.link', 'c.added_date')
        .where('c.c_id', '=', req.params.c_id);
    
    const sectionData = await db('sections as s')
        .select('s.s_id', 's.s_name', 's.s_text')
        .where('s.c_id', '=', req.params.c_id);

    let courseJson: Course = {
        "course_name": courseData[0].title,
        "course_subject": courseData[0].subject,
        "course_summary": courseData[0].c_text,
        "link": courseData[0].link,
        "date" : courseData[0].added_date,
        "sections": []
    }

    for (let section of sectionData) {
        let sectionPart:Section = {
            "section": section.s_name,
            "summary": section.s_text,
            "questions": []
        }
        const questionData = await db('questions as q')
            .select('q_text', 'q_ans', 'a1_text', 'a2_text', 'a3_text', 'a4_text')
            .where('q.s_id', '=', section.s_id);
        
        for (let question of questionData) {
            let questionPart:Question = {
                "question": question.q_text,
                "answer": question.q_ans,
                "a": question.a1_text,
                "b": question.a2_text,
                "c": question.a3_text,
                "d": question.a4_text
            };
            sectionPart.questions.push(questionPart);
        }
        courseJson.sections.push(sectionPart);
    }
    res.status(200).send(courseJson);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error.' });
  }
});

export default router;
