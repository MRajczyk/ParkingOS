import { Role } from "@prisma/client";

export default defineNuxtRouteMiddleware((to, from) => {
  const { status, data } = useAuth();

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

  if (
    //@ts-expect-error
    data.value?.user.role === Role.ADMIN &&
    (to.path.startsWith("/account") ||
      to.path.startsWith("/finder") ||
      to.path.startsWith("/payment") ||
      to.path.startsWith("/ticket"))
  ) {
    return navigateTo("/");
  }

  if (
    //@ts-expect-error
    data.value?.user.role === Role.USER &&
    to.path.startsWith("/admin")
  ) {
    return navigateTo("/");
  }
});
