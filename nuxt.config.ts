// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ["@sidebase/nuxt-auth"],
  // @ts-ignore
  auth: {
    provider: {
      type: "authjs",
    },
  },
});
