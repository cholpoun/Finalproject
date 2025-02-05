import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    // För att säkerställa att scrollningen sker efter att sidan har laddats.
    const scrollToElement = () => {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Vänta tills sidan är helt laddad
    window.addEventListener("load", scrollToElement);

    // Kontrollera om det finns en hash i URL:en när användaren navigerar
    if (location.hash) {
      scrollToElement();
    }

    // Ta bort event listenern när komponenten unmountar
    return () => {
      window.removeEventListener("load", scrollToElement);
    };
  }, [location]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
