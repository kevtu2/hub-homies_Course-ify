<template>
  <div class="flex justify-center bg-gray-100">
    <div class="p-6 w-full max-w-screen-xl mx-auto bg-white shadow-lg border border-gray-200">
      <h1 class="fancy-text">
        {{ courseData?.course_name }}
      </h1>
      <p class="mt-4 text-gray-800">
        {{ courseData?.course_summary }}
      </p>

      <Accordion value="0">
        <AccordionPanel v-for="(section, index) in courseData?.sections ?? []" :key="index" :value="index">
          <AccordionHeader>{{ section.section }}</AccordionHeader>
          <AccordionContent>
            {{ section.summary }}

            <Accordion value="0">
              <AccordionPanel v-for="(question, index2) in section.questions" :key="index2" :value="index2">
                <AccordionHeader>{{ "Q" + (index2 + 1) + ": " + question.question }}</AccordionHeader>
                <AccordionContent>
                  <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-2">
                      <RadioButton  inputId="answer1" name="answer" value="1" v-model="selectedAnswers[index][index2]"/>
                      <label for="answer1">{{ question.a }}</label>    
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioButton inputId="answer2" name="answer" value="2" v-model="selectedAnswers[index][index2]"/>
                      <label for="answer2">{{ question.b }}</label>  
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioButton inputId="answer3" name="answer" value="3" v-model="selectedAnswers[index][index2]"/>
                      <label for="answer3">{{ question.c }}</label>  
                    </div>
                    <div class="flex items-center gap-2">
                      <RadioButton inputId="answer4" name="answer" value="4" v-model="selectedAnswers[index][index2]"/>
                      <label for="answer4">{{ question.d }}</label>  
                    </div>
                  </div>
                  <Button class="mt-4" label="Submit" size="small" v-if="!answerCorrectness[index][index2]" @click="checkAnswer(index, index2)" />
                  
                </AccordionContent>
              </AccordionPanel>
            </Accordion>

          </AccordionContent>
        </AccordionPanel>
      </Accordion>

    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';

import { useRoute } from 'vue-router';

const route = useRoute();

interface Course {
  course_name: string;
  course_summary: string;
  sections: {
    section: string;
    summary: string;
    questions: {
      question: string;
      a: string;
      b: string;
      c: string;
      d: string;
      answer: string;
    }[];
  }[];
}

const courseData = ref<Course | null>(null);

const selectedAnswers = ref<(number | null)[][]>([]);
const answerCorrectness = ref<boolean[][]>([]);

const answerToDigitMap: { [key: string]: number } = {
  "A": 1,
  "B": 2,
  "C": 3,
  "D": 4,
};

const checkAnswer = (index: number, qIndex: number) => {
  if (!courseData.value) {
    alert('Course data is not loaded');
    return;
  }
  const realAnswer = courseData.value.sections[index].questions[qIndex].answer;
  const proposedAnswer = selectedAnswers.value[index][qIndex];
  if (selectedAnswers.value !== null) {
    if (Number(proposedAnswer) === answerToDigitMap[realAnswer]) {
      answerCorrectness.value[index][qIndex] = true;
    } else {
      answerCorrectness.value[index][qIndex] = false;
    }
  } else {
    alert('Please select an option!');
    console.log("The selectedAnswer variable answer: ", selectedAnswers.value[index][qIndex])
  }
};

watch(courseData, (newVal) => {
  if (newVal) {
    selectedAnswers.value = newVal.sections.map(section => section.questions.map(() => null));
    answerCorrectness.value = newVal.sections.map(section => section.questions.map(() => false));
  }
});

async function getCourseData(c_id : number) {
  try {
    const response = await axios.get('http://localhost:3000/api/courses/' + c_id);
    courseData.value = response.data;
  } catch (error) {
    console.error('Error: ', error);
  }
}

onMounted(async () => {
  await getCourseData(Number(route.params.id));
});

watch(route, async () => {
  await getCourseData(Number(route.params.id));
});

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
