// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: ["@sidebase/nuxt-auth", "nuxt-rate-limit"],
  // @ts-ignore
  auth: {
    provider: {
      type: "authjs",
    },
  },
  nuxtRateLimit: {
    routes: {
      "/api/auth/callback/credentials": {
        maxRequests: 5,
        intervalSeconds: 60,
      },
      "/api/reset-password": {
        maxRequests: 5,
        intervalSeconds: 60,
      },
      "/api/forgot-password": {
        maxRequests: 5,
        intervalSeconds: 60,
      },
    },
  },
});
