import { createBrowserRouter } from "react-router";
import HomePage from "./pages/Home";
import RootLayout from "./pages/RootLayout";
import ContactPage from "./pages/Contact";
import ErrorPage from "./pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage },
      { path: "contact", Component: ContactPage },
    ],
  },
]);
