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
                    Question #{{ qIndex }}
                  </AccordionHeader>
                  <AccordionContent>
                    <p class="mt-8 mb-8">{{ question.question }}</p>
                    <Form v-slot="$form" class="flex flex-col gap-4">
                      <div class="flex flex-col gap-2">
                        <div @submit="checkAnswerRoutine(index, qIndex)" name="quiz" class="flex flex-col gap-4">
                          <div class="flex items-center gap-2">
                            <RadioButton inputId="a" v-model="selectedAnswer" value="1" :invalid="answerCorrectness"/>
                            <label for="a">{{ question.a }}</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton inputId="b" v-model="selectedAnswer" value="2" :invalid="!answerCorrectness"/>
                            <label for="b">{{ question.b }}</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton inputId="c" v-model="selectedAnswer" value="3" :invalid="!answerCorrectness"/>
                            <label for="c">{{ question.c }}</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton inputId="d" v-model="selectedAnswer" value="4" :invalid="!answerCorrectness"/>
                            <label for="d">{{ question.d }}</label>
                          </div>
                        </div>
                      </div>
                      <Button v-if="!visibleAnswers[index][qIndex]" class="w-40" type="submit" severity="secondary" label="Submit" @click="checkAnswerRoutine(index,qIndex)" />
                      <Button v-if="visibleAnswers[index][qIndex]" class="w-40" type="button" severity="secondary" label="Hide the answer" @click="clearAnswerRoutine(index,qIndex)" />
                    </Form>
                    <p v-if="visibleAnswers[index][qIndex]" class="text-xl mt-5 mb-5">Reference Answer</p>
                    <p v-if="visibleAnswers[index][qIndex]">{{ mapAnswer[question.answer] }}</p>
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
import { ref } from 'vue';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import { Form } from '@primevue/forms';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const id = computed(() => {
  return route.params.id;
});

const courseData = ref({

  "course_name": "COURSE_NAME",
  "course_summary": "COURSE_SUMMARY",
  "sections": [
    {
      "section": "SECTION_NAME",
      "summary": "SECTION_SUMMARY",
      "questions": [
        {
          "question": "QUESTION",
          "answer": "4",
          "a": "OPTION1",
          "b": "OPTION2",
          "c": "OPTION3",
          "d": "OPTION4"
        },
        {
          "question": "QUESTION",
          "answer": "1",
          "a": "OPTION1",
          "b": "OPTION2",
          "c": "OPTION3",
          "d": "OPTION4"
        }
      ]
    },
    {
      "section": "SECTION_NAME",
      "summary": "SECTION_SUMMARY",
      "questions": [
        {
          "question": "QUESTION",
          "answer": "2",
          "a": "OPTION1",
          "b": "OPTION2",
          "c": "OPTION3",
          "d": "OPTION4"
        },
        {
          "question": "QUESTION",
          "answer": "3",
          "a": "OPTION1",
          "b": "OPTION2",
          "c": "OPTION3",
          "d": "OPTION4"
        }
      ]
    }
  ]
})

const mapAnswer: {
  [key: string]: string;
} = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D'
}

const visibleAnswers = ref(courseData.value.sections.map(section => section.questions.map(() => false)));
const answerCorrectness = ref(true);
const selectedAnswer = ref('');

const checkAnswerRoutine = (index: number, qIndex: number) => {
      const realAnswer = courseData.value.sections[index].questions[qIndex].answer;
      if (!Object.keys(mapAnswer).includes(realAnswer)) {
        alert('BUG: There is no valid answer for this question');
        console.log("proposed invalid answer: ",realAnswer)
        return;
      }
      if (selectedAnswer.value !== null) {
        if (selectedAnswer.value == realAnswer) {
          answerCorrectness.value = true;
        } else {
          answerCorrectness.value = false;
        }
        console.log("Answer correctness determination: ",answerCorrectness.value,"Real answer: ", realAnswer, ", selected answer: ",selectedAnswer);
      } else {
        alert('Please select an option!');
        console.log("The selectedAnswer variable answer: ",selectedAnswer.value)
      }
      toggleVisibility(index,qIndex);
    };

const clearAnswerRoutine = (index: number, qIndex: number) => {
  toggleVisibility(index,qIndex);
}

const toggleVisibility = async (index: number,qIndex: number) => {
  visibleAnswers.value[index][qIndex] = !visibleAnswers.value[index][qIndex];
}

axios.get('localhost:3000/api/courses/:c_id')
  .then(response => {
    response;
  })
  .catch(error => console.error('Error: ', error))
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
