import { app } from '@/main';

const lifeTime = 3000;

export function successToast(title: string = 'I am title', body: string = 'I am body'): void {
  app.config.globalProperties.$toast.add({severity: 'success', summary: title, detail: body, life: lifeTime});
}

export function infoToast(title: string = 'I am title', body: string = 'I am body'): void {
  app.config.globalProperties.$toast.add({severity: 'info', summary: title, detail: body, life: lifeTime});
};

export function warnToast(title: string = 'I am title', body: string = 'I am body'): void {
  app.config.globalProperties.$toast.add({severity: 'warn', summary: title, detail: body, life: lifeTime});
}  

export function errorToast(title: string = 'I am title', body: string = 'I am body'): void {
  app.config.globalProperties.$toast.add({severity: 'error', summary: title, detail: body, life: lifeTime});
};

export function secondaryToast(title: string = 'I am title', body: string = 'I am body'): void {
  app.config.globalProperties.$toast.add({severity: 'secondary', summary: title, detail: body, life: lifeTime});
}

export function contrastToast(title: string = 'I am title', body: string = 'I am body'): void {
  app.config.globalProperties.$toast.add({severity: 'contrast', summary: title, detail: body, life: lifeTime});
}