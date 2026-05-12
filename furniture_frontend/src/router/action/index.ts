import useAuthStore, { Status } from "@/store/authStore";
import api, { authApi } from "../../api";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router";
import { queryClient } from "@/api/query";
export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("login", credentials);
    if (response.status !== 200) {
      return { error: response.data || "Login Failed" };
    }
    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed" };
    } else throw error;
  }
};

export const logoutAction = async () => {
  try {
    await api.post("logout");
    sessionStorage.removeItem("products:last-filters");
    return redirect("/signin");
  } catch (error) {
    console.error("Logout Failed!", error);
  }
};

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("register", credentials);
    if (response.status !== 200) {
      return { error: response.data || "Login Failed" };
    }
    authStore.setAuth(response.data.phone, response.data.token, Status.otp);
    return redirect("/signup/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response?.data.message };
      }
    } else throw error;
  }
};

export const otpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("verifyOtp", credentials);
    authStore.setAuth(response.data.phone, response.data.token, Status.confirm);
    return redirect("/signup/confirm-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response?.data.message };
      }
    } else throw error;
  }
};

export const confirmAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };

  try {
    await authApi.post("confirmPassword", credentials);
    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response?.data.message };
      }
    } else throw error;
  }
};

export const favoriteAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (!params.productId) {
    throw new Error("No Product ID is provided");
  }
  const data = {
    productId: Number(params.productId),
    favorite: formData.get("favorite") === "true",
  };
  try {
    await api.patch("user/products/toggle-favorite", data);

    await queryClient.invalidateQueries({
      queryKey: ["products", "detail", params.productId],
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
  }
};

export const resetAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("forget-password", credentials);

    authStore.setAuth(response.data.phone, response.data.token, Status.verify);
    return redirect("/reset/verify");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response?.data.message };
      }
    } else throw error;
  }
};

export const verifyAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("verify", credentials);
    authStore.setAuth(response.data.phone, response.data.token, Status.reset);
    return redirect("/reset/new-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response?.data.message };
      }
    } else throw error;
  }
};

export const newPasswordAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };

  try {
    await authApi.post("reset-password", credentials);
    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response?.data.message };
      }
    } else throw error;
  }
};

export const changePasswordAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    await authApi.post("change-password", credentials);
    await api.post("logout");
    return redirect("/signin");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response?.data.message };
      }
    } else throw error;
  }
};
