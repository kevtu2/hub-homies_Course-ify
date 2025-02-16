<template>
  <div class="flex justify-center bg-gray-100">
    <div class="p-6 max-w-screen-xl mx-auto bg-white shadow-lg border border-gray-200">
      <h1 class="fancy-text">
        {{ courseData.course_name }}
      </h1>
      <p class="mt-4 text-gray-800">
        {{ courseData.course_summary }}
      </p>

      <Accordion value="0">
        <AccordionPanel :value="index" v-for="(section, index) in courseData.sections" :key="index">
          <AccordionHeader>{{ section.section }}</AccordionHeader>
          <AccordionContent>
            <div class="flex flex-col gap-4">
            <p class="mt-4">{{ section.summary }}</p>
            <p class="mt-5">Section Quiz</p>
            <Accordion value="0">
              <AccordionPanel :value="qIndex" v-for="(question, qIndex) in section.questions" :key="qIndex">
                              <AccordionHeader>
                  Question #{{ qIndex }}
                </AccordionHeader>
                <AccordionContent>
                  {{ question.question }}
                  <Form v-slot="$form" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
        <RadioButtonGroup name="ingredient" class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
                <RadioButton inputId="cheese" value="Cheese" />
                <label for="cheese">Cheese</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton inputId="mushroom" value="Mushroom" />
                <label for="mushroom">Mushroom</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton inputId="pepper" value="Pepper" />
                <label for="pepper">Pepper</label>
            </div>
            <div class="flex items-center gap-2">
                <RadioButton inputId="onion" value="Onion" />
                <label for="onion">Onion</label>
            </div>
        </RadioButtonGroup>
    </div>
    <Button type="submit" severity="secondary" label="Submit" />
</Form>
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

import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';


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
                   },
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
