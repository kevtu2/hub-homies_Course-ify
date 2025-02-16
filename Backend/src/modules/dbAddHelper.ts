import { db } from '../database/db';

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

export async function addCourseOutputToDatabase(theCourseJson: CourseJson) {
  let sections = theCourseJson['sections'];

  await db('courses')
    .insert({
      u_id: theCourseJson['u_id'],
      title: theCourseJson['course_name'],
      subject: theCourseJson['course_subject'],
      link: theCourseJson['link'],
      c_text: theCourseJson['course_summary'],
    })
    .then((course_id: any) => {
      let counter = 1;
      sections.forEach(async section => {
        let section_name = section['section'];
        let section_summary = section['summary'];
        await db('sections')
          .insert({
            c_id: course_id,
            position: counter,
            s_name: section_name,
            s_text: section_summary,
          })
          .then((section_id: any) => {
            let questions = section['questions'];
            let counter2 = 1;
            questions.forEach(async question => {
              let question_text = question['question'];
              let answer = question['answer'];
              let a = question['a'];
              let b = question['b'];
              let c = question['c'];
              let d = question['d'];
              await db('questions').insert({
                s_id: section_id,
                position: counter2,
                q_text: question_text,
                q_ans: answer,
                a1_text: a,
                a2_text: b,
                a3_text: c,
                a4_text: d,
              });
              counter2++;
            });
          });
        counter++;
      });
    });
}