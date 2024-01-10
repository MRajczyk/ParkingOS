<script setup>
useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" }, //, crossorigin: "true"},
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800;900&display=swap",
    },
  ],
});
</script>

<template>
  <NuxtPage />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: "Inter";
}

html {
  height: 100%;
}

body {
  height: 100%;
}

#__nuxt {
  height: 100%;
}
</style>
