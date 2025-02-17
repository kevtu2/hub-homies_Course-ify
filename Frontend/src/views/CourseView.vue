<template>
  <div class="flex justify-center bg-gray-100 grow">
    <div class="p-6 w-full max-w-screen-xl mx-auto bg-white shadow-lg border border-gray-200">
      <div class="flex justify-between">
        <h1 class="fancy-text">
          {{ courseData?.course_name }}
        </h1>

        <div>
          <Button class="mr-4" icon="pi pi-share-alt" variant=text rounded />

          {{ Math.floor(Math.random() * 100) }}
          <Button icon="pi pi-thumbs-up" variant=text rounded />
        </div>
      </div>

      <div class="text-lg mb-1">
        {{ courseData?.course_subject ? courseData.course_subject + " | " + (courseData.date ? new Date(courseData.date).toLocaleDateString() : '') : '' }}
      </div>

      <div>
        <iframe width="600" height="315"
          :src="'https://www.youtube.com/embed/' + (courseData?.link ? getId(courseData.link) : '')">
        </iframe>
      </div>

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
                <AccordionHeader><span v-if="answerVisibility[index][index2]&&answerCorrectness[index][index2]" class="pi pi-check"></span><span v-else></span>{{ "Q" + (index2 + 1) + ": " + question.question }}</AccordionHeader>
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
                  <!-- <Button class="mt-4" label="Submit" size="small" v-if="!answerCorrectness[index][index2]" @click="checkAnswer(index, index2)" /> -->
                  <Button class="w-40 m-8" type="submit" severity="secondary" label="Submit" v-if="!answerVisibility[index][index2]" @click="checkAnswer(index,index2)" />
                  <Button v-if="answerVisibility[index][index2]" class="w-40 m-8" type="button" severity="secondary" label="Clear the answer" @click="clearAnswer(index,index2)" />
                  <p v-if="answerVisibility[index][index2]&&!answerCorrectness[index][index2]" class="text-xl mt-5 mb-5">Incorrect. Reference Answer: {{ question.answer }}</p>
                  <p v-if="answerVisibility[index][index2]&&answerCorrectness[index][index2]" class="text-xl mt-5 mb-5">You are Correct!</p>
                  
                </AccordionContent>
              </AccordionPanel>
            </Accordion>

          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      

      <iframe v-if="pdfCert" :src="pdfCert" width="100%" height="600px"></iframe>

      <div class="w-full" v-if=allRight>
        <div class="text-2xl mt-4">
          Congratulations!
        </div>
        <div>
          You've successfully completed {{ courseData?.course_name }}. Below is your cerficate in text!
        </div>
        <Textarea v-model="rewardText" class="w-full" style="resize: none" rows=10 >

        </Textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

import 'primeicons/primeicons.css';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea';
import { successToast } from '../modules/toastHelper';
import { useAuthStore } from '../stores/auth';

import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();

const pdfCert = ref('');

interface Course {
  course_name: string;
  course_summary: string;
  link: string;
  course_subject: string;
  date: string;
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
const answerVisibility = ref<boolean[][]>([]);

const answerToDigitMap: { [key: string]: number } = {
  "A": 1,
  "B": 2,
  "C": 3,
  "D": 4,
};

function getId(url : string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

const allRight = ref(false)
const rewardText = ref('');

const checkAnswer = async (index: number, qIndex: number) => {
  let temp = true
  for(let i = 0; i < answerCorrectness.value.length; i++) {
    if(temp == false) {
      break;
    }
    for(let j = 0; j < answerCorrectness.value[i].length; j++) {
      if(answerCorrectness.value[i][j] == false) {
        temp = false;
        break;
      }
    }
  }
  temp = true;
  if(temp == true) {
    rewardText.value = 
              "Certificate of Achievement\n\n" +
          "This certificate is presented to " + (authStore.isLoggedIn ? authStore.username : "Guest") + ". As members of the course-ify team, we proudly present to you your certification of completing the course " + (courseData.value ? courseData.value.course_name : 'NYLL') + " on " + new Date().toLocaleString() + ". We hope you strive for excellence in this field and for reach even greater heights.\n\n" +
          "Sincerely,\n\n" +
          "The Course-ify team";
    
    allRight.value = true
    successToast("Congratulations!", "You've completed " + courseData.value?.course_name + ". Scroll to the bottom to view your prize!")
  }

  if (!courseData.value) {
    alert('Course data is not loaded');
    return;
  }
  const realAnswer = courseData.value.sections[index].questions[qIndex].answer;
  const proposedAnswer = selectedAnswers.value[index][qIndex];
  if (selectedAnswers.value[index][qIndex] !== null) {
    answerVisibility.value[index][qIndex] = true;
    if (Number(proposedAnswer) === answerToDigitMap[realAnswer]) {
      answerCorrectness.value[index][qIndex] = true;
    } else {
      answerCorrectness.value[index][qIndex] = false;
    }
  } else {
    alert('Please select an option!');
  }
};

const clearAnswer = (index: number, qIndex: number) => {
  answerVisibility.value[index][qIndex] = false;
  selectedAnswers.value[index][qIndex] = null;
  answerCorrectness.value[index][qIndex] = false;
};

watch(courseData, (newVal) => {
  if (newVal) {
    selectedAnswers.value = newVal.sections.map(section => section.questions.map(() => null));
    answerCorrectness.value = newVal.sections.map(section => section.questions.map(() => false));
    answerVisibility.value = newVal.sections.map(section => section.questions.map(() => false));
  }
});

async function getCourseData(c_id : number) {
  try {
    const response = await axios.get('http://localhost:3000/api/courses/' + c_id);
    courseData.value = response.data;
  } catch (error) {
    console.error('Error: ', error);
  }

  /*
  try {
    const result = await axios.get('http://localhost:3000/api/courses/cert/' + c_id, {
      responseType: 'blob'
    })
    const pdfBlob = result.data;
    pdfCert.value =  URL.createObjectURL(pdfBlob);
    console.log(pdfCert.value)
  } catch (error) {
    console.error('PDF Error: ' + error)
  }
    */
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
  font-size: 3rem; /* Large size for visibility */
  font-weight: bold; /* Bold text */
  color: #4A90E2; /* Modern blue text color */

  /* Multiple shadows to create a subtle blue outline around the text */
  /* text-shadow:
    -2px 0 #A2B9E8,
    2px 0 #A2B9E8,
    0 2px #A2B9E8,
    0 -2px #A2B9E8,
    2px 2px #A2B9E8,
    -2px -2px #A2B9E8,
    2px -2px #A2B9E8,
    -2px 2px #A2B9E8; */
}

</style>
