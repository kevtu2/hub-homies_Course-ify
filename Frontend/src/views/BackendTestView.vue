<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';

import axios from 'axios';
import { ref } from 'vue';

const operations = ref([
  { name: 'Create', code: 'C' },
  { name: 'Put', code: 'U' },
  { name: 'Delete', code: 'D' },
  { name: 'Get', code: 'G' },
]);

const selectedOperation = ref({
  name: '',
  code: '',
});

const url = ref('');
const body = ref('');
const output = ref('');

async function askApi() {
  try {
    const response = await axios.post('http://localhost:3000/api/course', {
      title: 'Test title',
      link: 'Test link',
    });
    console.log('Posted');
    console.log(response.data.message);
  } catch (error) {
    console.error('Failed to post.');
  }
}
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col gap-3">
      <Select
        optionLabel="name"
        v-model="selectedOperation"
        :options="operations"
        placeholder="CRUD Command"
      />

      Ex. localhost:3000/api/books
      <InputText v-model="url" placeholder="Route Name" />

      Ex. '{ name: 'bob' }'
      <InputText v-model="body" placeholder="Json Body as String" />

      <Button label="Submit" @click="askApi" />

      Output:
      {{ output }}
    </div>
  </main>
</template>

<style scoped></style>
