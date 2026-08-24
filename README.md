# Winston Technologies

Professional careers, business and technology website with a React/Vite client and Express/MongoDB API.

## Deploy the client

Deploy `client/` as a Vercel project. The included `client/vercel.json` keeps React Router routes working on refresh.

Set this environment variable in the hosting dashboard:

```text
VITE_API_URL=https://your-api-host.example.com/api
```

Build command: `npm run build`  
Output directory: `dist`

## Deploy the API

Deploy `server/` as a Node web service. `render.yaml` contains the service definition for Render.

Required server variables:

```text
MONGO_URI=mongodb+srv://...
JWT_SECRET=<long-random-secret>
CLIENT_URL=https://your-client-domain.example.com
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<strong-admin-password>
```

Never commit `.env` files or real credentials. After MongoDB is available, create the admin account with:

```bash
npm run seed:admin
```

The admin can then sign in at `/login`; only users with the `ADMIN` role can access `/admin`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
