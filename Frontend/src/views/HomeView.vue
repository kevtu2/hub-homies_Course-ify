<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import axios from 'axios';

// async function submit() {
//   try {
//     await axios.post('PLACEHOLDER LINK',{
//       title:,
//       link:
//     });
//   }
// }
</script>

<template>
<div class="flex flex-col items-center justify-center v-screen h-[80%] gap-5">
  <p class="text-5xl">COURSE-IFY</p>
  <p class="text-2xl mb-20">We make YouTube videos into an interactive course</p>
  <div class="flex items-center justify-center w-[80%] gap-4">
    <InputText placeholder="Put your YouTube video link here" class="p-inputtext-lg w-[80%]" size="large" />
    <Button label='Submit' />
  </div>
</div>
</template>

<style scoped></style>
