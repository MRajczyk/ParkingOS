export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth();
  if (
    status.value !== "authenticated" &&
    to.path !== "/signin" &&
    to.path !== "/signup"
  ) {
    return navigateTo("/signin");
  }
});
