import { redirect, type LoaderFunctionArgs } from "react-router";
import { authApi } from "../../api";
import useAuthStore, { Status } from "@/store/authStore";
import {
  categoryTypeQuery,
  infiniteProductsQuery,
  onePostQuery,
  oneProductQuery,
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

export const verifyLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.verify) {
    return redirect("/reset");
  }
  return null;
};

export const newPasswordLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.reset) {
    return redirect("/reset");
  }
  return null;
};

export const changePasswordLoader = async () => {
  try {
    await authApi.get("auth-check");
    return null;
  } catch (error) {
    console.log(error);
    return redirect("/signin");
  }
};

export const blogInfiniteLoader = async () => {
  await queryClient.ensureInfiniteQueryData(postInfiniteQuery());
  return null;
};

export const postDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.postId) {
    throw new Error("No Post Id is provided");
  }
  await queryClient.ensureQueryData(postQuery("?limit=6"));
  await queryClient.ensureQueryData(onePostQuery(Number(params.postId)));
  return { productId: params.postId };
};

export const productInfiniteLoader = async () => {
  await queryClient.ensureQueryData(categoryTypeQuery());
  await queryClient.prefetchInfiniteQuery(infiniteProductsQuery());
  return null;
};

export const productDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.productId) {
    throw new Error("No Product Id is provided");
  }
  await queryClient.ensureQueryData(productQuery("?limit=6"));
  await queryClient.ensureQueryData(oneProductQuery(Number(params.productId)));
  return { productId: params.productId };
};
