// @ts-ignore
import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, User } from "@prisma/client";
import { compareSync } from "bcrypt";

const prisma = new PrismaClient();

export default NuxtAuthHandler({
  callbacks: {
    // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as unknown as User;
        return {
          ...token,
          id: u.id,
          email: u.email,
          name: u.name,
          surname: u.surname,
        };
      }
      return token;
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          surname: token.surname,
          email: token.email,
        },
      };
    },
    redirect: async ({ url, baseUrl }) => {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const valid = compareSync(credentials.password, user.password);

        if (!valid) {
          return null;
        }
        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          surname: user.surname,
        };
      },
    }),
  ],
});
