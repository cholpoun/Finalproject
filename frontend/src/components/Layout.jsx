import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollToElement = () => {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.hash) {
      if (
        location.pathname === "/profile" &&
        location.hash === "#favorite-festivals"
      ) {
        setTimeout(() => {
          scrollToElement();
        }, 100);
      } else {
        navigate(location.pathname, { replace: true });
        setTimeout(() => {
          scrollToElement();
        }, 100);
      }
    }
  }, [location, navigate]); 

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
