<template>
  <div class="flex justify-center bg-gray-100">
    <div class="p-6 w-full max-w-screen-xl mx-auto bg-white shadow-lg border border-gray-200">
      <h1 class="fancy-text">
        {{ courseData.course_name }}
      </h1>
      <p class="mt-4 text-gray-800">
        {{ courseData.course_summary }}
      </p>

      <Accordion :value="['0']" multiple>
        <AccordionPanel :value="index" v-for="(section, index) in courseData.sections" :key="index">
          <AccordionHeader>{{ section.section }}</AccordionHeader>
          <AccordionContent>
            <div class="flex flex-col gap-4">
              <p class="mt-4">{{ section.summary }}</p>
              <p class="text-xl">Section Quiz</p>
              <Accordion :value="['1']" multiple>
                <AccordionPanel :value="qIndex" v-for="(question, qIndex) in section.questions" :key="qIndex">
                  <AccordionHeader>
                    Question #{{ qIndex+1 }}
                  </AccordionHeader>
                  <AccordionContent>
                    <p class="mt-8 mb-8">{{ question.question }}</p>
                    <Form v-slot="$form" class="flex flex-col gap-4">
                      <div class="flex flex-col gap-2">
                        <div @submit="checkAnswerRoutine(index, qIndex)" class="flex flex-col gap-4">
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="selectedAnswer[index][qIndex]" value="1" :invalid="!answerCorrectness[index][qIndex]"/>
                            <label for="a">{{ question.a }}</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="selectedAnswer[index][qIndex]" value="2" :invalid="!answerCorrectness[index][qIndex]"/>
                            <label for="b">{{ question.b }}</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="selectedAnswer[index][qIndex]" value="3" :invalid="!answerCorrectness[index][qIndex]"/>
                            <label for="c">{{ question.c }}</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="selectedAnswer[index][qIndex]" value="4" :invalid="!answerCorrectness[index][qIndex]"/>
                            <label for="d">{{ question.d }}</label>
                          </div>
                        </div>
                      </div>
                      <Button v-if="!visibleAnswers[index][qIndex]" class="w-40" type="submit" severity="secondary" label="Submit" @click="checkAnswerRoutine(index,qIndex)" />
                      <Button v-if="visibleAnswers[index][qIndex]" class="w-40" type="button" severity="secondary" label="Clear the answer" @click="clearAnswerRoutine(index,qIndex)" />
                    </Form>
                    <p v-if="visibleAnswers[index][qIndex]&&!answerCorrectness[index][qIndex]" class="text-xl mt-5 mb-5">Incorret.<br>Reference Answer:</p>
                    <p v-if="visibleAnswers[index][qIndex]&&!answerCorrectness[index][qIndex]">{{ mapAnswer[question.answer] }}</p>
                    <p v-if="visibleAnswers[index][qIndex]&&answerCorrectness[index][qIndex]" class="text-xl mt-5 mb-5">You are Correct!</p>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

onMounted(async () => {
  await getCourseData(Number(route.params.id));
});

const id = computed(async () => {
  await getCourseData(Number(route.params.id));
  return route.params.id;
});

interface Question {
  question: string;
  answer: string;  // Assuming the answer is stored as a string (e.g., the index of the correct option)
  a: string;
  b: string;
  c: string;
  d: string;
}

interface Section {
  section: string;
  summary: string;
  questions: Question[];
}

interface CourseData {
  course_name: string;
  course_summary: string;
  sections: Section[];
}

const courseData = ref<CourseData>({
  course_name: '',
  course_summary: '',
  sections: [],
});
// const courseData = ref({

//   "course_name": "COURSE_NAME",
//   "course_summary": "COURSE_SUMMARY",
//   "sections": [
//     {
//       "section": "SECTION_NAME",
//       "summary": "SECTION_SUMMARY",
//       "questions": [
//         {
//           "question": "QUESTION",
//           "answer": "4",
//           "a": "OPTION1",
//           "b": "OPTION2",
//           "c": "OPTION3",
//           "d": "OPTION4"
//         },
//         {
//           "question": "QUESTION",
//           "answer": "1",
//           "a": "OPTION1",
//           "b": "OPTION2",
//           "c": "OPTION3",
//           "d": "OPTION4"
//         }
//       ]
//     },
//     {
//       "section": "SECTION_NAME",
//       "summary": "SECTION_SUMMARY",
//       "questions": [
//         {
//           "question": "QUESTION",
//           "answer": "2",
//           "a": "OPTION1",
//           "b": "OPTION2",
//           "c": "OPTION3",
//           "d": "OPTION4"
//         },
//         {
//           "question": "QUESTION",
//           "answer": "3",
//           "a": "OPTION1",
//           "b": "OPTION2",
//           "c": "OPTION3",
//           "d": "OPTION4"
//         }
//       ]
//     },
//     {
//       "section": "SECTION_NAME",
//       "summary": "SECTION_SUMMARY",
//       "questions": [
//         {
//           "question": "QUESTION",
//           "answer": "2",
//           "a": "OPTION1",
//           "b": "OPTION2",
//           "c": "OPTION3",
//           "d": "OPTION4"
//         },
//         {
//           "question": "QUESTION",
//           "answer": "3",
//           "a": "OPTION1",
//           "b": "OPTION2",
//           "c": "OPTION3",
//           "d": "OPTION4"
//         }
//       ]
//     }
//   ]
// })

const mapAnswer: {
  [key: string]: string;
} = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D',
  'A': 'A',
  'B': 'B',
  'C': 'C',
  'D': 'D',
}

async function getCourseData(c_id : Number) {
  try {
    const response = await axios.get('http://localhost:3000/api/courses/' + c_id);
    courseData.value = response.data;
  } catch (error) {
    console.error('Error: ', error);
  }
}

const visibleAnswers = ref<boolean[][]>(courseData.value.sections.map((section:Section) => section.questions.map(() => false)));
const answerCorrectness = ref<boolean[][]>(courseData.value.sections.map((section:Section) => section.questions.map(() => true)));
const selectedAnswer = ref<string[][]>(courseData.value.sections.map((section:Section) => section.questions.map(() => '')));
console.log("visibleAnswers: ",visibleAnswers.value, "courseData: ",courseData.value);

const checkAnswerRoutine = (index: number, qIndex: number) => {
      const realAnswer = mapAnswer[courseData.value.sections[index].questions[qIndex].answer];
      const proposedAnswer = mapAnswer[selectedAnswer.value[index][qIndex]];
      if (!Object.keys(mapAnswer).includes(realAnswer)) {
        alert('BUG: There is no valid answer for this question');
        console.log("proposed invalid answer: ", realAnswer)
        return;
      }
      console.log("const proposedAnswer: ",proposedAnswer," const answerCorrectness: ",answerCorrectness.value[index]);
      if (proposedAnswer !== undefined) {
        if (proposedAnswer == realAnswer) {
          answerCorrectness.value[index][qIndex] = true;
        } else {
          answerCorrectness.value[index][qIndex] = false;
        }
        console.log("Answer correctness determination: ",answerCorrectness.value[index][qIndex],"Real answer: ", realAnswer, ", selected answer: ",selectedAnswer.value[index][qIndex]);
      } else {
        alert('Please select an option!');
        console.log("The selectedAnswer variable answer: ",selectedAnswer.value[index][qIndex]);
        return;
      }
      toggleVisibility(index,qIndex);
    };

const clearAnswerRoutine = (index: number, qIndex: number) => {
  answerCorrectness.value[index][qIndex] = true;
  selectedAnswer.value[index][qIndex] = '';
  toggleVisibility(index,qIndex);
}

const toggleVisibility = async (index: number,qIndex: number) => {
  visibleAnswers.value[index][qIndex] = !visibleAnswers.value[index][qIndex];
}
</script>

<style scoped>
html,
body {
  height: 100%;
  /* Ensure the body takes up the full height of the viewport */
  margin: 0;
  /* Remove default margin */
  overflow-y: auto;
  /* Enable vertical scrolling */
}

.fancy-text {
  font-size: 3rem;
  /* Large size for visibility */
  font-weight: bold;
  /* Bold text */
  color: #228B22;
  /* Green text color (center) */

  /* Multiple shadows to create a gold outline around the green text */
  text-shadow:
    -2px 0 #E0C261,
    2px 0 #E0C261,
    0 2px #E0C261,
    0 -2px #E0C261,
    2px 2px #E0C261,
    -2px -2px #E0C261,
    2px -2px #E0C261,
    -2px 2px #E0C261;
}
</style>
