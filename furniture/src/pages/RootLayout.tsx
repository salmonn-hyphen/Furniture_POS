import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";

function RootLayout() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default RootLayout;
