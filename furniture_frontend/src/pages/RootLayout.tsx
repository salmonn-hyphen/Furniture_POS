import { Outlet } from "react-router-dom";
import Header from "../components/Layouts/Header";
import { ThemeProvider } from "../components/theme-provider";
import Footer from "../components/Layouts/Footer";
function RootLayout() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-screen flex-col overflow-hidden">
          <Header />
          <main className="mt-16 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}

export default RootLayout;
