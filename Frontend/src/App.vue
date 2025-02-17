<script setup lang="ts">
import { RouterView } from 'vue-router';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { Form } from '@primevue/forms';
import Toast from 'primevue/toast';
import FloatLabel from 'primevue/floatlabel';

import { successToast, errorToast } from './modules/toastHelper';
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

const courses = ref<Course[]>([]);

const items = computed(() => {
  return [
    {
      label: 'Create',
      icon: 'pi pi-home',
      command: () => {
        router.push('/');
      },
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      command: () => {
        router.push('/dashboard');
      },
    },
    {
      label: 'Courses',
      icon: 'pi pi-book',
      badge: Object.keys(courses.value).length,
      items: courses.value,
    },
  ];
});

function addCourseToMenu(courseString: string, courseRoute: string) {
  courses.value.push({
    label: courseString,
    route: courseRoute,
    command: () => {
      router.push(courseRoute);
    },
  });
}

onMounted(async () => {
  await tryStartupLogin();
  await getCourses();
  usr_strk.value = 123;
});

const usr_strk = ref(0)
const loginEmailInput = ref('');
const loginPasswordInput = ref('');

const loginDialogVisible = ref(false);
async function tryLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: loginEmailInput.value,
      pwd: loginPasswordInput.value,
    });

    if (response.data != null) {
      Cookies.set('token', response.data.token);
      authStore.login(response.data.name, response.data.u_id);
      loginDialogVisible.value = false;
      successToast('Success', 'Logged in successfully');
    } else {
      errorToast('Error', 'Login unsuccessful');
    }
  } catch (error) {
    errorToast('Error', 'Login unsuccessful');
    console.error(error);
  }
}

async function tryStartupLogin() {
  if (Cookies.get('token') == null) {
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:3000/api/auth/tokenLogin',
      {},
      {
        headers: {
          authorization: Cookies.get('token'),
        },
      },
    );

    if (response.data != null) {
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
  successToast('Success', 'Logged out successfully');
}

async function getCourses() {
  try {
    const courseIds = await axios.get('http://localhost:3000/api/courses/getIds');
    for (let i = 0; i < Object.keys(courseIds.data).length; i++) {
      addCourseToMenu(courseIds.data[i]['title'] + ' - ' + courseIds.data[i]['subject'] + ' - ' + new Date(courseIds.data[i]['added_date']).toLocaleDateString(), `/course/${courseIds.data[i]['c_id']}`);
    }
    console.log("Retrieved courses successfully!");
  } catch (error) {
    console.error(error);
  }
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
    });
    if (response.data != null) {
      Cookies.set('token', response.data.token);
      authStore.login(response.data.name, response.data.u_id);
      createAccountDialogVisible.value = false;
      successToast('Success', 'Account created successfully');
    } else {
      errorToast('Error', 'Account creation unsuccessful');
    }
  } catch (error) {
    errorToast('Error', 'Account creation unsuccessful');
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
          <Badge v-if="item.badge" :value="item.badge" />
          <span
            v-if="item.shortcut"
            class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down ml-auto',
              { 'pi-angle-down': root, 'pi-angle-right': !root },
            ]"
          ></i>
        </a>
      </template>
      <template #end>
        <div v-if="isLoggedIn" class="flex items-center">
          <div class="flex items-center gap-2">
            {{ usr_strk }}
            <i class="pi pi-calendar" />
          </div>

          <div class="ml-4">
            {{ username }}
          </div>
          <Button class="ml-2" @click="tryLogout" severity="secondary" icon="pi pi-sign-out" />
        </div>
        <div class="flex gap-2">
          <Button
            v-if="!isLoggedIn"
            @click="createAccountDialogVisible = true"
            severity="secondary"
            icon="pi pi-user-plus"
          />
          <Button
            v-if="!isLoggedIn"
            @click="loginDialogVisible = true"
            severity="secondary"
            icon="pi pi-sign-in"
          />
        </div>
      </template>
    </Menubar>

    <RouterView />

    <Dialog v-model:visible="loginDialogVisible" :dismissableMask="true" modal header="Login">
      <Form class="flex flex-col">
        <FloatLabel class="mt-5">
          <InputText v-model="loginEmailInput" type="email" autocomplete="email" id="email" />
          <label for="email">Email</label>
        </FloatLabel>

        <FloatLabel class="mt-7">
          <InputText
            v-model="loginPasswordInput"
            type="password"
            autocomplete="current-password"
            id="password"
          />
          <label for="password">Password</label>
        </FloatLabel>
      </Form>

      <template #footer>
        <Button @click="tryLogin" severity="secondary" label="Login" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="createAccountDialogVisible"
      :dismissableMask="true"
      modal
      header="Create Account"
    >
      <Form class="flex flex-col">
        <FloatLabel class="mt-5">
          <InputText v-model="createEmailInput" type="email" autocomplete="email" id="email" />
          <label for="email">Email</label>
        </FloatLabel>
        <FloatLabel class="mt-7">
          <InputText
            v-model="createUsernameInput"
            type="username"
            autocomplete="username"
            id="username"
          />
          <label for="username">Username</label>
        </FloatLabel>
        <FloatLabel class="mt-7">
          <InputText
            v-model="createPasswordInput"
            type="password"
            autocomplete="new-password"
            id="password"
          />
          <label for="password">Password</label>
        </FloatLabel>
      </Form>

      <template #footer>
        <Button @click="tryCreateAccount" severity="secondary" label="Create Account" />
      </template>
    </Dialog>

    <Toast />
  </main>
</template>

<style scoped></style>
