import { Outlet } from "react-router-dom";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import AuthBootstrap from "../features/auth/components/AuthBootstrap";
import ThemeToggle from "../components/theme/ThemeToggle.jsx";

const Rootlayout = () => {
  return (
    <AuthBootstrap>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />

      <ThemeToggle />
    </AuthBootstrap>
  );
};

export default Rootlayout;
