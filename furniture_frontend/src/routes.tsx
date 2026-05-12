import { createBrowserRouter, redirect } from "react-router";
import HomePage from "./pages/Home";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/Error";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About";
import BlogDetail from "./pages/Blog/BlogDetail";
import BlogRootLayout from "./pages/Blog/BlogRootLayout";
import ProductRootLayout from "./pages/Products/ProductRootLayout";
import Product from "./pages/Products/Product";
import ProductDetail from "./pages/Products/ProductDetail";
import Login from "./components/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import {
  changePasswordAction,
  confirmAction,
  favoriteAction,
  loginAction,
  logoutAction,
  newPasswordAction,
  otpAction,
  registerAction,
  resetAction,
  verifyAction,
} from "./router/action";
import {
  blogInfiniteLoader,
  changePasswordLoader,
  confirmLoader,
  homeLoader,
  loginLoader,
  newPasswordLoader,
  otpLoader,
  postDetailLoader,
  productDetailLoader,
  signupLoader,
  verifyLoader,
} from "./router/loader";
import AuthRootLayout from "./pages/Auth/AuthRootLayout";
import OtpVerify from "./pages/Auth/OtpVerify";
import ConfirmPassword from "./pages/Auth/ConfirmPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ResetOtpVerify from "./pages/Auth/ResetOtpVerify";
import NewPassword from "./pages/Auth/NewPassword";
import ChangePassword from "./pages/ChangePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage, loader: homeLoader },
      { path: "about", Component: About },
      {
        path: "blogs",
        Component: BlogRootLayout,
        children: [
          { index: true, Component: Blog, loader: blogInfiniteLoader },
          { path: ":postId", Component: BlogDetail, loader: postDetailLoader },
        ],
      },
      {
        path: "products",
        Component: ProductRootLayout,
        children: [
          { index: true, Component: Product },
          {
            path: ":productId",
            Component: ProductDetail,
            loader: productDetailLoader,
            action: favoriteAction,
          },
        ],
      },
      {
        path: "/change-password",
        Component: ChangePassword,
        action: changePasswordAction,
        loader: changePasswordLoader,
      },
    ],
  },
  {
    path: "/signin",
    Component: Login,
    action: loginAction,
    loader: loginLoader,
  },
  {
    path: "/signup",
    Component: AuthRootLayout,
    action: registerAction,
    children: [
      {
        index: true,
        Component: SignUp,
        loader: signupLoader,
      },
      {
        path: "otp",
        Component: OtpVerify,
        loader: otpLoader,
        action: otpAction,
      },
      {
        path: "confirm-password",
        Component: ConfirmPassword,
        action: confirmAction,
        loader: confirmLoader,
      },
    ],
  },
  {
    path: "/logout",
    action: logoutAction,
    loader: () => redirect("/"),
  },
  {
    path: "/reset",
    Component: AuthRootLayout,
    children: [
      {
        index: true,
        Component: ResetPassword,
        action: resetAction,
      },
      {
        path: "verify",
        Component: ResetOtpVerify,
        loader: verifyLoader,
        action: verifyAction,
      },
      {
        path: "new-password",
        Component: NewPassword,
        action: newPasswordAction,
        loader: newPasswordLoader,
      },
    ],
  },
]);
