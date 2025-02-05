import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Funktion som scrollar till rätt element
    const scrollToElement = () => {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Om vi har en hash i URL:en
    if (location.hash) {
      // Kolla om vi redan är på den sidan och scrolla direkt, eller navigera först
      if (
        location.pathname === "/profile" &&
        location.hash === "#favorite-festivals"
      ) {
        setTimeout(() => {
          scrollToElement();
        }, 100);
      } else {
        // Navigera till rätt sida (profile eller annan) och sen scrolla
        navigate(location.pathname, { replace: true });
        setTimeout(() => {
          scrollToElement();
        }, 100);
      }
    }
  }, [location, navigate]); // Beroende på både location och navigate

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
