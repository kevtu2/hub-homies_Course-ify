# Full Stack Template

Want to skip setup and get straight to the coding your full stack idea correctly? 
Use this template complete with multiple industry standard tools with a quick and easy setup to get you going. 
Whatever your idea, you should be able to build it with these.

## Setup

1. Clone the repository

2. Check the README.md files of the Frontend and Backend folders. The setup needs to be completed for each folder (you need to cd into them).

## Workflow

1. Make sure you've done the setup. Open two separate terminals, and cd into them. You should have terminals that have endings like this:

```sh
A_Path\FullStackBoilerPlate\Frontend
```
```sh
A_Path\FullStackBoilerPlate\Backend
```

2. Turn MySQL server on (Make sure Docker Desktop is running):

```sh
npm run sqlon
```

3. In both terminals, run this:

```sh
npm run dev
```

This will setup the development server for both sides which will refresh when you save. From here you should be good to go! 

I would also recommend you run the lint and format commands before you commit!

## What's Inside

### Frontend

1. Vue [Vue](https://vuejs.org/)
    - Pinia [Pinia](https://pinia.vuejs.org/)
    - Vue Router [VueRouter](https://router.vuejs.org/)
2. PrimeVue Components [PrimeVue](https://primevue.org/)
3. Tailwind.css [Tailwind](https://tailwindcss.com/)
4. Dev Tools:
    - Vite [Vite](https://vite.dev/)

### Backend

1. Node.js [Node.js](https://nodejs.org/en)
2. Express [Express](https://expressjs.com/)
3. Dev Tools:
    - Nodemon [Nodemon](https://nodemon.io/)

### Other/General

1. TypeScript [TypeScript](https://www.typescriptlang.org/)
2. Prettier [Prettier](https://prettier.io/)
3. LsLint [LsLint](https://ls-lint.org/)