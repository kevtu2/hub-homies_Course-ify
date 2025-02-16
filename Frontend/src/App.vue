<script setup lang="ts">
import { RouterView } from 'vue-router';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { Form } from '@primevue/forms';

import { useAuthStore } from './stores/auth';

import router from '@/router';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const authStore = useAuthStore();

interface Course {
  label: string;
  route: string;
  command: () => void;
}

const courses = ref<Course[]>([])

const items = computed(() => {
  return [
    {
      label: 'Create Course',
      icon: 'pi pi-home'
    },
    {
      label: 'Courses',
      icon: 'pi pi-book',
      badge: Object.keys(courses.value).length,
      items: courses.value
    }
  ]
})

function addCourseToMenu(courseName : string, courseRoute : string) {
  courses.value.push({
    label: courseName,
    route: courseRoute,
    command: () => {
      router.push(courseRoute);
    }
  });
}

onMounted(async () => {
  await tryStartupLogin();

  addCourseToMenu('Course 1', '/course/1');
  addCourseToMenu('Course 2', '/course/2');
  addCourseToMenu('Course 3', '/course/3');
  addCourseToMenu('Course 4', '/course/4');
});

const loginEmailInput = ref('');
const loginPasswordInput = ref('');

const loginDialogVisible = ref(false);
async function tryLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: loginEmailInput.value,
      pwd: loginPasswordInput.value,
    });
    
    if(response.data != null) {
      Cookies.set('token', response.data.token);
      authStore.login(response.data.name, response.data.u_id);
    }
  } catch (error) {
    console.error(error);
  }
}

async function tryStartupLogin() {
  if(Cookies.get('token') == null) { return; }

  try {
    const response = await axios.post('http://localhost:3000/api/auth/tokenLogin', {}, {
      headers: {
        'authorization': Cookies.get('token')
      }
    });

    if(response.data != null) {
      
      Cookies.set('token', response.data.token);  
      authStore.login(response.data.name, response.data.u_id);
    }
  } catch (error) {
    console.log(error);
  }
}

async function tryLogout() {
  Cookies.remove('token');
  authStore.logout();
}

const createAccountDialogVisible = ref(false);
const createEmailInput = ref('');
const createUsernameInput = ref('');
const createPasswordInput = ref('');
async function tryCreateAccount() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/createAccount', {
      email: createEmailInput.value,
      name: createUsernameInput.value,
      pwd: createPasswordInput.value,
    })
    if(response.data != null) {
      Cookies.set('token', response.data.token);
      authStore.login(response.data.name, response.data.u_id);
    }
  } catch (error) {
    console.error(error); 
  }
}

const isLoggedIn = computed(() => authStore.isLoggedIn);
const username = computed(() => authStore.username);
const u_id = computed(() => authStore.u_id);
</script>

<template>
  <main class="flex flex-col h-screen">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu, root }">
          <a class="flex items-center" v-bind="props.action">
              <span>{{ item.label }}</span>
              <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
              <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
              <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
          </a>
      </template>
      <template #end>
        <div v-if="isLoggedIn">
          {{ username }}
          <Button class="ml-2" @click="tryLogout" severity="secondary" icon="pi pi-sign-out" />
        </div>
        <div class="flex gap-2">
          <Button v-if="!isLoggedIn" @click="createAccountDialogVisible = true" severity="secondary" icon="pi pi-user-plus" />
          <Button v-if="!isLoggedIn" @click="loginDialogVisible = true" severity="secondary" icon="pi pi-sign-in" />
        </div>
      </template>
    </Menubar>

    <RouterView />

    <Dialog v-model:visible="loginDialogVisible" :dismissableMask="true" modal header="Login">
      <Form class="flex flex-col gap-2">
        <InputText 
          v-model="loginEmailInput"
          placeholder="Email"
          type="email"
          autocomplete="email"
        />

        <InputText 
          v-model="loginPasswordInput"
          placeholder="Password" 
          type="password"
          autocomplete="current-password"
        />
      </Form>

      <template #footer>
        <Button @click="tryLogin" severity="secondary" label="Login" />
      </template>
    </Dialog>

    <Dialog v-model:visible="createAccountDialogVisible" :dismissableMask="true" modal header="Create Account">
      
      <Form class="flex flex-col gap-2">
        <InputText
          v-model="createEmailInput"
          placeholder="Email"
          type="email"
          autocomplete="email"
        />
        <InputText
          v-model="createUsernameInput"
          placeholder="Username"
          type="username"
          autocomplete="username"
        />
        <InputText
          v-model="createPasswordInput"
          placeholder="Password"
          type="password"
          autocomplete="new-password"
        />
      </Form>

      <template #footer>
        <Button @click="tryCreateAccount" severity="secondary" label="Create Account" />
      </template>
    </Dialog>
  </main>
</template>

<style scoped></style>
