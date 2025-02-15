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
  switch (selectedOperation.value.code) {
    case 'C':
      try {
        const response = await axios.post(url.value, body.value ? JSON.parse(body.value) : {});
        output.value = response.data
        console.log('Create operation successful.');
      } catch (error) {
        console.error(error);
      }
      break;
    case 'U':
      try {
        const response = await axios.put(url.value, {
          title: title.value,
          author: author.value,
          date_published: date_published.value,
        });
        output.value = response.data
        console.log('Update operation successful.');
      } catch (error) {
        console.error(error);
      }
      break;
    case 'D':
      try {
        const response = await axios.delete(url.value);
        output.value = response.data
        console.log('Delete operation successful.');
      } catch (error) {
        console.error(error);
      }
      break;
    case 'G':
      try {
        const response = await axios.get(url.value, body.value ? JSON.parse(body.value) : {});
        output.value = response.data 
        console.log('Get operation successful.')
      } catch (error) {
        console.error(error)
      }
    default:
      console.log('Invalid operation');
      break;
  }
}
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col gap-3">
      <Select optionLabel="name" v-model="selectedOperation" :options="operations" placeholder="CRUD Command" />

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
