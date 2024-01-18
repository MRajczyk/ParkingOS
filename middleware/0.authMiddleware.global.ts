export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth();

  if (
    status.value !== "authenticated" &&
    to.path !== "/signin" &&
    to.path !== "/signup" &&
    !to.path.startsWith("/forgot-password")
  ) {
    return navigateTo("/signin");
  }

  if (
    status.value === "authenticated" &&
    (to.path === "/signin" ||
      to.path === "/signup" ||
      to.path.startsWith("/forgot-password"))
  ) {
    return navigateTo("/");
  }
});
