import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";
import { ThemeProvider } from "../components/theme-provider";
import Footer from "../components/layouts/Footer";
function RootLayout() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}

export default RootLayout;
