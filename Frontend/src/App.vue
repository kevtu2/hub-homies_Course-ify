<script setup lang="ts">
import { RouterView } from 'vue-router';
import Menubar from 'primevue/menubar';
import router from '@/router';

import { ref } from 'vue';

const items = ref([
  {
    label: 'Books',
    icon: 'pi pi-book',
    command: () => {
      router.push({ name: 'home' });
    },
  },
  {
    label: 'About',
    icon: 'pi pi-question-circle',
    command: () => {
      router.push({ name: 'about' });
    },
  },
]);
</script>

<template>
  <main class="flex flex-col h-screen">
    <Menubar :model="items" />

    <RouterView />
  </main>
</template>

<style scoped></style>
