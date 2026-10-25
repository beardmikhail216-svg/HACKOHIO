# ProjectHub

ProjectHub is a web app for discovering and organizing collaborative software projects. Browse projects, create your own, manage participant registrations, and get project recommendations based on your interests and technical skills.

## Features

- Register and sign in with a persistent session.
- Browse project listings and view project details.
- Create and manage projects, including open or approval-based registration.
- Register for projects and manage requests for projects you own.
- Keep a profile of your interests, languages, frameworks, and databases.
- Get project recommendations ranked by profile matches.

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose
- **Database and sessions:** MongoDB

## Requirements

- Node.js and npm
- Docker with Docker Compose, or a MongoDB instance

## Run locally

### 1. Start MongoDB

From the repository root, start the MongoDB container:

```sh
docker compose up -d
```

The Compose configuration exposes MongoDB on `localhost:27018` and stores its data in a named volume.

If you use your own MongoDB instance instead, use its connection URI in the backend configuration below.

### 2. Configure and start the backend

Create `server/.env` with the following values:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27018/projecthub
SESSION_SECRET=replace-with-a-unique-random-secret
PORT=5000
```

Generate a suitable session secret with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then install dependencies and start the API:

```sh
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Check that it is available at `http://localhost:5000/api/health`.

### 3. Start the frontend

In a separate terminal:

```sh
cd client
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The client connects to the API at `http://localhost:5000` and uses cookies for authenticated requests.

## Useful commands

Run these from the corresponding `client` or `server` directory:

| Command | Directory | Purpose |
| --- | --- | --- |
| `npm run dev` | `client` | Start the Vite development server |
| `npm run build` | `client` | Build the frontend for production |
| `npm run lint` | `client` | Run ESLint |
| `npm run dev` | `server` | Start the API with automatic restarts |
| `npm start` | `server` | Start the API |

## Project structure

```text
client/   React frontend
server/   Express API, MongoDB models, and matching logic
docs/     Project documentation
docker-compose.yml  Local MongoDB service
```
