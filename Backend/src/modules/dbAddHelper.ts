import { db } from '../database/db'

interface CourseJson {
    course_name: string;
    course_summary: string;
    u_id: string;
    course_subject: string;
    link: string;
    sections: SectionJson[];
}

interface SectionJson {
    section: string;
    summary: string;
    questions: QuestionJson[];
}

interface QuestionJson {
    question: string;
    answer: string;
    a: string;
    b: string;
    c: string;
    d: string;
}

async function addCourseOuputToDatabase(theCourseJson: CourseJson) {
    let course_name = theCourseJson['course_name']
    let course_summary = theCourseJson['course_summary']
    let sections = theCourseJson['sections']

    db('courses').insert({
        u_id: theCourseJson['u_id'],
        title: theCourseJson['course_name'],
        subject: theCourseJson['course_subject'],
        link: theCourseJson['link'],
        c_text: theCourseJson['course_summary'],
    }).then((course_id: any) => {
        let counter = 1
        sections.forEach((section) => {
            let section_name = section['section']
            let section_summary = section['summary']
            db('sections').insert({
                c_id: course_id,
                position: counter,
                s_name: section_name,
                s_text: section_summary
            }).then((section_id: any) => {
                let questions = section['questions']
                let counter2 = 1
                questions.forEach((question) => {
                    let question_text = question['question']
                    let answer = question['answer']
                    let a = question['a']
                    let b = question['b']
                    let c = question['c']
                    let d = question['d']
                    db('questions').insert({
                        s_id: section_id,
                        position: counter2,
                        q_text: question_text,
                        q_ans: answer,
                        a1_text: a,
                        a2_text: b,
                        a3_text: c,
                        a4_text: d
                    })
                    counter2++;
                })
            })
            counter++;
        })
    })

    db('courses').insert({
        course_name: course_name,
        course_summary: course_summary
    }).then((course_id: any) => {
        sections.forEach((section) => {
            let section_name = section['section']
            let section_summary = section['summary']
            db('sections').insert({
                course_id: course_id,
                section_name: section_name,
                section_summary: section_summary
            }).then((section_id: any) => {
                let questions = section['questions']
                questions.forEach((question) => {
                    let question_text = question['question']
                    let answer = question['answer']
                    let a = question['a']
                    let b = question['b']
                    let c = question['c']
                    let d = question['d']
                    db('questions').insert({
                        section_id: section_id,
                        question_text: question_text,
                        answer: answer,
                        a: a,
                        b: b,
                        c: c,
                        d: d
                    })
                })
            })
        })
    })
}

/*
{
    "course_name": "COURSE_NAME",
    "course_summary": "COURSE_SUMMARY",
    "poster_id": ,
    "course_subject": ,
    "course_link": ,
    "sections": [
        {
            "section": "SECTION_NAME",
            "summary": "SECTION_SUMMARY",
            "questions" : [
                    {
                    "question" : "QUESTION",
                    "answer" : "ANSWER",
                    "a" : "OPTION1",
                    "b" : "OPTION2",
                    "c" : "OPTION3",
                    "d" : "OPTION4"
                    }
            ]
        }
    ]
}
*/