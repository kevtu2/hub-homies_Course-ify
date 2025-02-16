<template>
  <div class="flex justify-center bg-gray-100">
    <div class="p-6 max-w-screen-lg mx-auto bg-white shadow-lg border border-gray-200">
      <h1 class="fancy-text">
        {{ courseData.course_name }}
      </h1>
      <p class="mt-4 text-gray-800">
        {{ courseData.course_summary }}
      </p>

      <Accordion value="0">
        <AccordionPanel :value="index" v-for="(section,index) in courseData.sections">
          <AccordionHeader>{{ section.section }}</AccordionHeader>
          <AccordionContent>{{ section.summary }}</AccordionContent>

          <Accordion value="1" v-for="(question,index) in section.questions">
            <AccordionPanel :value="index">
              <AccordionHeader>
                Question # {{ index }}
             </AccordionHeader>
             <AccordionContent>
                {{ question.question }}
             </AccordionContent>
            </AccordionPanel>
          </Accordion>
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

const courseData = ref({
  "course_name": "COURSE_NAME",
    "course_summary": "COURSE_SUMMARY",
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
})

axios.get('LINK TBD')
     .then(response => {
        response;
     })
     .catch(error => console.error('Error: ',error))
</script>

<style scoped>
html, body {
  height: 100%; /* Ensure the body takes up the full height of the viewport */
  margin: 0;    /* Remove default margin */
  overflow-y: auto; /* Enable vertical scrolling */
}

.fancy-text {
  font-size: 3rem;        /* Large size for visibility */
  font-weight: bold;      /* Bold text */
  color: #228B22;         /* Green text color (center) */

  /* Multiple shadows to create a gold outline around the green text */
  text-shadow:
    -2px 0   #E0C261,
    2px  0   #E0C261,
    0   2px  #E0C261,
    0  -2px  #E0C261,
    2px  2px #E0C261,
    -2px -2px #E0C261,
    2px  -2px #E0C261,
    -2px  2px #E0C261;
}
</style>
