<template>
  <div class="flex justify-center bg-gray-100">
    <div class="p-6 w-full max-w-screen-xl mx-auto bg-white shadow-lg border border-gray-200">
      <h1 class="text-3xl font-bold">
        {{ profileNameText }}
      </h1>

      <div class="text-xl mt-2">
        Total Followers: {{ followers.length }}
      </div>

      <Accordion :multiple="true">
        <AccordionTab header="Achievements">
          <div class="grid grid-cols-4 gap-4">
            <Card v-for="achievement in achievements" :key="achievement.u_id">
              <template #title>
                {{ achievement.ach_name }}
                <i class="pi pi-star"></i>
              </template>
              <template #content>
                {{ achievement.ach_text }}
              </template>
            </Card>
          </div>
        </AccordionTab>
        <AccordionTab header="Courses">
          <div class="grid grid-cols-4 gap-4">
            <Card v-for="course in courses" :key="course.c_id" @click="router.push('/course/' + course.c_id)" class="cursor-pointer">
              <template #title>
                {{ course.title }}
                <i class="pi pi-book"></i>
              </template>
              <template #subtitle>
                {{ course.subject + " | " + new Date(course.added_date).toLocaleDateString() }}
              </template>
              <template #content>
                <div class="overflow-auto max-h-40">
                  {{ course.c_text }}
                </div>
              </template>
            </Card>
          </div>
        </AccordionTab>
        <AccordionTab header="Users">
          <div class="grid grid-cols-5 gap-4">
            <Card v-for="user in users" :key="user.u_id" class="cursor-pointer">
              <template #content>
                <div class="flex items-center justify-between">
                  <div class="font-bold">
                    {{ user.name }}
                  </div>
                  <Button 
                  icon="pi pi-plus" 
                  size="small" 
                  rounded 
                  />
                </div>
              </template>
            </Card>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Card from 'primevue/card';
import axios from 'axios';
import Button from 'primevue/button';
import Cookies from 'js-cookie';

import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn)
const profileNameText = computed(() => {
  if(isLoggedIn.value) {
    return authStore.username + "'s Profile";
  } else {
    return 'Profile';
  }
})

interface Follower {
  f_id: number;
  flwer: string;
  ach_text: string;
}

const followers = ref<Follower[]>([]);
interface Achievement {
  u_id: number;
  ach_name: string;
  ach_text: string;
}

const users = ref<User[]>([]);
interface User {
  u_id: number;
  name: string;
}

const achievements = ref<Achievement[]>([]);
interface Course {
  c_id: number;
  title: string;
  added_date: string;
  subject: string;
  c_text: string;
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
    /*
    const followersResponse = await axios.get('http://localhost:3000/api/followers/' + authStore.u_id, {
      headers: {
        authorization: Cookies.get('token'),
      },
    });
    followers.value = followersResponse.data;
    console.log(followers.value);
    */
    const usersResponse = await axios.get('http://localhost:3000/api/users/publicData');
    users.value = usersResponse.data;
    console.log(users.value);

    const achievementsResponse = await axios.get('http://localhost:3000/api/achievements', {
      headers: {
        authorization: Cookies.get('token'),
      },
    });
    achievements.value = achievementsResponse.data;
    console.log(achievements.value);
    
    const coursesResponse = await axios.get('http://localhost:3000/api/courses/getIds');
    courses.value = coursesResponse.data;

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

