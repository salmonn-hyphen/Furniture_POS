import { Outlet } from "react-router-dom";

function BlogRootLayout() {
  return (
    <>
      <div>BlogRootLayout</div>
      <Outlet />;
    </>
  );
}

export default BlogRootLayout;
