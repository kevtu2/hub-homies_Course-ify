<template>
  <div class="flex justify-center bg-gray-100">
    <div class="p-6 w-full max-w-screen-xl mx-auto bg-white shadow-lg border border-gray-200">
      <h1 class="fancy-text">User Profile</h1>

      <div class="follower-count">
        Total Followers: {{ followers.length }}
      </div>

      <Accordion>
        <!-- Dynamic Accordion for Each Category -->
        <AccordionTab header="Followers">
          <ul>
            <li v-for="follower in followers" :key="follower.f_id">{{ follower.flwer }}</li>
          </ul>
        </AccordionTab>

        <AccordionTab header="Achievements">
          <ul>
            <li v-for="achievement in achievements" :key="achievement.u_id">{{ achievement.ach_name }}</li>
          </ul>
        </AccordionTab>

        <AccordionTab header="Sections">
          <ul><li v-for="section in sections" :key="section.s_id">{{ section.s_name }}</li></ul>
        </AccordionTab>
      </Accordion>

      <Accordion v-if="selectedCourseSections.length > 0">
        <AccordionTab header="Sections">
          <ul>
            <li v-for="section in selectedCourseSections" :key="section.id">{{ section.title }}</li>
          </ul>
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

interface Follower {
  f_id: number;
  flwer: string;
}

const followers = ref<Follower[]>([]);
interface Achievement {
  u_id: number;
  ach_name: string;
}

const achievements = ref<Achievement[]>([]);
interface Course {
  c_id: number;
  title: string;
  sections: { id: number; title: string }[];
}

const courses = ref<Course[]>([]);

const selectedCourse = ref(null);
const selectedCourseSections = computed(() => {
  const course = courses.value.find(c => c.c_id === selectedCourse.value);
  return course ? course.sections : [];
});
interface Section {
  s_id: number;
  s_name: string;
}

const sections = ref<Section[]>([]);
async function fetchData() {
  try {
    const followersResponse = await axios.get('http://localhost:3000/api/followers/' + authStore.u_id, {
      headers: {
        authorization: Cookies.get('token'),
      },
    });
    followers.value = followersResponse.data;

    const achievementsResponse = await axios.get('http://localhost:3000/api/achievements/achievedachievements', {
      headers: {
        authorization: Cookies.get('token'),
      },
    });
    achievements.value = achievementsResponse.data;
    
    const coursesResponse = await axios.get('http://localhost:3000/api/courses/getIds');
    courses.value = coursesResponse.data;
    console.log(courses.value);

    /*
    const sectionsResponse = await axios.get('http://localhost:3000/api/user/:u_id/section/:s_id');
    sections.value = sectionsResponse.data;
    */
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}


onMounted(async () => {
  await fetchData();
})

/*
async function fetchSectionsForCourse(courseId) {
  try {
    const response = await axios.get(`/api/sections?courseId=${courseId}`);
    sections.value = response.data;
  } catch (error) {
    console.error('Failed to fetch sections:', error);
  }
}
*/
</script>

<style scoped>
/* Your existing styles */
.follower-count {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #333;
}
</style>

