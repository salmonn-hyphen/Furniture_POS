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
  confirmAction,
  loginAction,
  logoutAction,
  otpAction,
  registerAction,
} from "./router/action";
import {
  blogInfiniteLoader,
  confirmLoader,
  homeLoader,
  loginLoader,
  otpLoader,
  signupLoader,
} from "./router/loader";
import AuthRootLayout from "./pages/Auth/AuthRootLayout";
import OtpVerify from "./pages/Auth/OtpVerify";
import ConfirmPassword from "./pages/Auth/ConfirmPassword";

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
          { path: ":postId", Component: BlogDetail },
        ],
      },
      {
        path: "products",
        Component: ProductRootLayout,
        children: [
          { index: true, Component: Product },
          { path: ":productId", Component: ProductDetail },
        ],
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
]);
