import { redirect } from "react-router";
import { authApi } from "../../api";
import useAuthStore, { Status } from "@/store/authStore";
import {
  postInfiniteQuery,
  postQuery,
  productQuery,
  queryClient,
} from "@/api/query";

export const homeLoader = async () => {
  await queryClient.ensureQueryData(productQuery("?limit=8"));
  await queryClient.ensureQueryData(postQuery("?limit=3"));
  return null;
};

export const loginLoader = async () => {
  try {
    await authApi.get("auth-check");
    return redirect("/");
  } catch (error) {
    console.log("Loader error:", error);
  }
};

export const signupLoader = async () => {
  const authStore = useAuthStore.getState();

  try {
    await authApi.get("auth-check");
    return redirect("/");
  } catch (error) {
    console.log("Loader error:", error);
  }

  // Reset stale signup progress when user intentionally lands on /signup.
  if (authStore.status !== Status.none) {
    authStore.clearAuth();
  }

  return null;
};

export const otpLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.otp) {
    return redirect("/signup");
  }
  return null;
};

export const confirmLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.confirm) {
    return redirect("/signup");
  }
  return null;
};

export const blogInfiniteLoader = async () => {
  await queryClient.ensureInfiniteQueryData(postInfiniteQuery());
  return null;
};
