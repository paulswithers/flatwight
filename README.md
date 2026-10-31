# Flat Wight Website

Open this repository in VS Code and use the Remote - Containers (or Codespaces) extension to "Reopen in Container".

What the container provides:

- Node.js 18 LTS (official devcontainer image)
- Common JS/TS extensions (Prettier, ESLint) installed inside the container
- `npm install` runs automatically after the container is created

Ports:

- 5173 — Vite dev server

To run the app inside the container:

1. Open a terminal in VS Code (inside the container)
1. Start the dev server:

```cmd
npm run dev
```

1. Open the forwarded port at `http://localhost:5173` (VS Code will also show a popup link)

Notes:

- If you prefer a different Node version, edit `.devcontainer/devcontainer.json` and change the `image` or `Dockerfile` ARG.
- If you want the container to automatically run the dev server, add `initializeCommand` or a task that runs `npm run dev`.
