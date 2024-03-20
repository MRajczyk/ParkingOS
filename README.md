# ParkingOS
Group project for Advanced Web Applications at the University made with Nuxt.

##My contributions:
- App configuration + db dockerization.
- Most of the styling.
- Various FE components (ex. Topbar).
- Auth module (endpoints and views) with password recovery through email (gmail smtp).
- User profile management panel (full CRUD).
- Various modules for admin panel + took up work on charts from one group member.
- Ensured reactivity on views made by myself.
- Limited the number of logins allowed in a given period of time from a given IP address.
- Provided session validation for protected BE endpoints.

## Preview (some screen from running app)
![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/7c892eeb-9479-44d1-a766-c38370c1dbe4)
![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/a756f385-2f84-47ab-97da-10977fd2c0cf)
![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/484034ec-4ec4-4138-90ef-95790ef0a61a)
![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/83413b4a-9a92-41c9-bd5d-4c67f1658e5f) ![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/075f95ae-814b-481a-877e-a055cf316ddc)
![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/d259dd65-6013-4896-9b0b-c8004f044f85)
![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/f18694c6-8aca-4c99-9e85-9cb80ffbe454)
![image](https://github.com/MRajczyk/ParkingOS/assets/103463343/62b71b12-bf27-4fc6-889d-c0f56e7cee73)

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
