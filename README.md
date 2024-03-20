# ParkingOS
Group project for Advanced Web Applications at the University made with Nuxt. <br>
My contributions:
- App configuration + db dockerization.
- Most of the styling.
- Various FE components (ex. Topbar).
- Auth module (endpoints and views) with password recovery through email (gmail smtp).
- User profile management panel (full CRUD).
- Various modules for admin panel + took up work on charts from one group member.
- Ensured reactivity on views made by myself.
- Limited the number of logins allowed in a given period of time from a given IP address.
- Provided session validation for protected BE endpoints.

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
