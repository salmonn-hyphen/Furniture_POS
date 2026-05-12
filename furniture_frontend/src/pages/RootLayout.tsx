import { Outlet } from "react-router-dom";
import Header from "../components/Layouts/Header";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/sonner";
import Footer from "../components/Layouts/Footer";
import ScrollTop from "@/components/Layouts/ScrollTop";
function RootLayout() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-screen flex-col overflow-hidden">
          <Header />
          <main className="mt-16 flex-1">
            <ScrollTop />
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default RootLayout;
