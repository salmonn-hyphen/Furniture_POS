import { createBrowserRouter } from "react-router";
import HomePage from "./pages/Home";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/Error";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About";
import BlogDetail from "./pages/Blog/BlogDetail";
import BlogRootLayout from "./pages/Blog/BlogRootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: About },
      {
        path: "blogs",
        Component: BlogRootLayout,
        children: [
          { index: true, Component: Blog },
          { path: ":postId", Component: BlogDetail },
        ],
      },
    ],
  },
]);
