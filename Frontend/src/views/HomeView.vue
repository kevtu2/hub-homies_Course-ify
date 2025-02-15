<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { onMounted, ref } from 'vue';
import axios from 'axios';

onMounted(async () => {
  await getBookData();
});

async function getBookData() {
  try {
    const response = await axios.get('http://localhost:3000/api/books');
    books.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

const id = ref('');
const title = ref('');
const author = ref('');
const date_published = ref(null);

async function submit() {
  switch (selectedOperation.value.code) {
    case 'C':
      try {
        await axios.post('http://localhost:3000/api/books', {
          title: title.value,
          author: author.value,
          date_published: date_published.value,
        });
        console.log('Create operation successful.');
      } catch (error) {
        console.error(error);
      }
      break;
    case 'U':
      try {
        await axios.put('http://localhost:3000/api/books/' + String(id.value), {
          title: title.value,
          author: author.value,
          date_published: date_published.value,
        });
        console.log('Update operation successful.');
      } catch (error) {
        console.error(error);
      }
      break;
    case 'D':
      try {
        await axios.delete('http://localhost:3000/api/books/' + String(id.value));
        console.log('Delete operation successful.');
      } catch (error) {
        console.error(error);
      }
      break;
    default:
      console.log('Invalid operation');
      break;
  }
  await getBookData();
}

const selectedOperation = ref({
  name: '',
  code: '',
});
const operations = ref([
  { name: 'Create', code: 'C' },
  { name: 'Update', code: 'U' },
  { name: 'Delete', code: 'D' },
]);

const books = ref([]);
</script>

<template>
  <main class="flex flex-col items-center mt-2 gap-2">
    <Card>
      <template #title> My Cool Book Database </template>
      <template #content>
        <div class="flex flex-col gap-2">
          <Select
            optionLabel="name"
            v-model="selectedOperation"
            :options="operations"
            placeholder="CRUD Command"
          />

          <InputText
            v-model="id"
            v-if="selectedOperation.code == 'U' || selectedOperation.code == 'D'"
            placeholder="ID"
          />
          <InputText
            v-model="title"
            v-if="selectedOperation.code != 'D' && selectedOperation.code != ''"
            placeholder="Title"
          />
          <InputText
            v-model="author"
            v-if="selectedOperation.code != 'D' && selectedOperation.code != ''"
            placeholder="Author"
          />
          <DatePicker
            v-model="date_published"
            v-if="selectedOperation.code != 'D' && selectedOperation.code != ''"
            placeholder="Publication Date"
          />

          <Button v-if="selectedOperation.code != ''" label="Submit" @click="submit" />
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <DataTable :value="books">
          <Column field="id" header="ID"></Column>
          <Column field="title" header="Title"></Column>
          <Column field="author" header="Author"></Column>
          <Column field="date_published" header="Publication Date"></Column>
          <Column field="date_added" header="Date Added"></Column>
        </DataTable>
      </template>
    </Card>
  </main>
</template>

<style scoped></style>
