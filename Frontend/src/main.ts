import './assets/main.css';
import './index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const coolPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{Blue.50}',
      100: '{Blue.100}',
      200: '{Blue.200}',
      300: '{Blue.300}',
      400: '{Blue.400}',
      500: '{Blue.500}',
      600: '{Blue.600}',
      700: '{Blue.700}',
      800: '{Blue.800}',
      900: '{Blue.900}',
      950: '{Blue.950}',
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: coolPreset,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
      darkModeSelector: false || 'none',
    },
  },
});

app.mount('#app');
