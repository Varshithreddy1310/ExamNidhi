# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and `typescript-eslint` in your project.

## 🚀 Deployment on Vercel

To deploy this frontend on Vercel:

1.  **Project Settings**: Set the **Root Directory** to `FRONTEND/mini` (if deploying from the project root).
2.  **Build Command**: `npm run build` (automatic).
3.  **Output Directory**: `dist` (automatic).
4.  **Environment Variables**: 
    - Add `VITE_BACKEND_URL`: Set this to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).
5.  **Routing**: The included `vercel.json` ensures that client-side routing works correctly (avoids 404 on refresh).

## 🛠️ Local Development

1. Create a `.env` file based on `.env.example`.
2. Run `npm install`.
3. Run `npm run dev`.

