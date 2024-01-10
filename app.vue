<script setup>
useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" }, //, crossorigin: "true"},
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;400;500;600;700;800;900&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
    },
  ],
});
</script>

<template>
  <NuxtPage />
</template>

<style>
:root {
  --primary-lighter: #304d30;
  --bg-light: #eef0e5;
  --shadow: #5c5c5c;
  --bg-darker: #dde7dd;
}

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
