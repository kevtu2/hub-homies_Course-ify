<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import { successToast } from '../modules/toastHelper';

import { errorToast } from '../modules/toastHelper';
import Cookies from 'js-cookie';

import axios from 'axios';
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const link = ref('');
const title = ref('');
const visible = ref(false);

const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);

const submitTitle = async () => {
  loading.value = true;
  if (!title.value.trim()) {
    errorToast('Warning', 'You must provide a title!');
  } else {
    try {
      await axios.post('http://localhost:3000/api/course', {
        link: link.value,
        title: title.value,
      },
      {
        headers: {
          authorization: Cookies.get('token'),
        },
      });
      successToast("New Course Created!", "Your new course is ready to go!");
    } catch (error) {
      errorToast('Error', 'Error submitting link:' + error);
    }
  }
  visible.value = false;
  loading.value = false;
};

const submitLink = async () => {
  if(!isLoggedIn.value) {
    errorToast('Warning', 'You must be logged in to submit a link!');
  } else if (!link.value.trim()) {
    errorToast('Warning', 'You must provide a link!');
  } else {
    visible.value = true;
  }
};

const loading = ref(false);
</script>

<template>
  <div class="flex flex-col items-center justify-center v-screen h-[80%] gap-5">
    <p class="text-5xl">COURSE-IFY</p>
    <p class="text-2xl mb-20">We make YouTube videos into an interactive course</p>

    <div class="flex items-center justify-center w-[80%] gap-4">
      <InputText
        v-model="link"
        placeholder="Put your YouTube video link here"
        class="p-inputtext-lg w-[80%]"
        size="large"
      />
      <Button label="Submit" @click="submitLink" />
    </div>
  </div>

  <Dialog
    v-model:visible="visible"
    modal
    header="Edit the Course Title"
    :style="{ width: '25rem' }"
    class="flex content-center items-center"
  >
    <div  class="h-40 w-40 flex content-center items-center" v-if="loading">
      <ProgressSpinner />
    </div>
    <div class="flex items-center gap-4 mb-4" v-if="!loading">
      <label for="course title" class="font-semibold w-24">Title</label>
      <InputText v-model="title" id="course title" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Save" @click="submitTitle" v-if="!loading" ></Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
