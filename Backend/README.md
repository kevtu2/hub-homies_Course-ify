# Backend

## Project Setup

1. Install Node.js (If you don't have it already):
   https://nodejs.org/en/download

2. Install Dependencies. Make sure you are cd'd into this folder before running (A_Path\FullStackBoilerPlate\Backend). Run this:

```sh
npm install
```

3. Install Docker Desktop (For MySQL local server)
   https://docs.docker.com/get-started/introduction/get-docker-desktop/

4. Optionally install MySQL Workbench (For easy access to MySQL local server)
   https://www.mysql.com/products/workbench/

   Setup new MySQL connection with values:

   - Hostname = 127.0.0.1
   - Username = user
   - Port = 3306

   You can now connect to it with the password: userpassword

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Turn on MySQL Docker Server (Will not work if Docker Desktop isn't running)

```sh
npm run sqlon
```

### Turn off MySQL Docker Server

```sh
npm run sqloff
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Format with [Prettier](https://prettier.io/)

```sh
npm run format
```
