import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Smile, Menu, X } from "lucide-react";

const breakpoints = {
  tablet: "768px",
  laptop: "1200px",
};

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8cdda 0%, #1b93d1 100%);
  backdrop-filter: blur(15px);
  z-index: 50;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: top 0.3s ease-in-out;
  border-radius: 0 0 12px 12px;
  left: 0;
  padding: 0 12px;
  display: flex;
  justify-content: center;
`;

const NavbarContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  height: 4rem;
  gap: 1rem;
`;

const Logo = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #fff;
`;

const NavLinks = styled.div`
  display: none;
  flex-direction: column;
  position: absolute;
  top: 4rem;
  left: 0;
  width: 100%;
  gap: 20px;

  &.open {
    display: flex;
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: flex;
    flex-direction: row;
    position: static;
    background: transparent;
  }
`;

const NavLink = styled(Link)`
  transition: color 0.3s;
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-family: "Quicksand", sans-serif;
  border-radius: 8px;

  &:hover {
    color: #ffcc00;
  }
`;

const NavbarIcons = styled.div`
  display: flex;
  gap: 1.1rem;
  margin-left: auto;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }

  button:hover svg {
    transform: scale(1.2);
    transition: transform 0.3s ease-in-out;
  }

  @media (min-width: ${breakpoints.tablet}) {
    margin-right: 1.5rem;
  }
`;

const HamburgerMenu = styled.button`
  border: none;
  cursor: pointer;
  background-color: transparent;

  svg {
    width: 2rem;
    height: 2rem;
    color: white;
  }

  &:hover {
    opacity: 0.8;
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 4rem;
  right: 0;
  min-height: 100%;
  width: auto;
  background: rgba(248, 205, 218, 0.9);
  z-index: 100;
  transition: transform 0.3s ease-in-out;
  transform: translateX(100%);
  border-radius: 12px 0 0 12px;

  &.open {
    transform: translateX(0);
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const SidebarLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding: 1rem;

  & a {
    color: #333;
    font-size: 1.5rem;
    text-decoration: none;
  }
`;

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      navigate("/users/authenticate");
    }
  };

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    // När man klickar på favoriter, skrollar vi till den rätta sektionen.
    setTimeout(() => {
      const favoritesSection = document.getElementById("favorite-festivals");

      if (favoritesSection) {
        favoritesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        navigate(`/profile/${userId}`);
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (prevScroll > currentScroll) {
        document.querySelector("nav").style.top = "0";
      } else {
        document.querySelector("nav").style.top = "-80px";
      }
      setPrevScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

  return (
    <NavbarContainer>
      <NavbarContent>
        <NavLink to="/" aria-label="Go to Home">
          <Logo>NextFest</Logo>
        </NavLink>
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <NavbarIcons>
            <button onClick={handleProfileClick} aria-label="Go to Profile">
              <Smile style={{ color: "white" }} />
            </button>
          </NavbarIcons>
          <NavLinks>
            <NavLink to="/" aria-label="Go to Home">
              Home
            </NavLink>
            <NavLink to="/about" aria-label="About Us">
              About Us
            </NavLink>
            <NavLink to="/festivals" aria-label="View Festivals">
              Festivals
            </NavLink>
            <NavLink to="#" onClick={handleProfileClick} aria-label="Profile">
              Profile
            </NavLink>
            <NavLink
              to="#"
              onClick={handleFavoritesClick}
              aria-label="Favorites"
            >
              Favorites
            </NavLink>
          </NavLinks>
        </div>
        <HamburgerMenu onClick={toggleSidebar} aria-label="Toggle Menu">
          {isSidebarOpen ? <X /> : <Menu />}
        </HamburgerMenu>
      </NavbarContent>

      <Sidebar className={isSidebarOpen ? "open" : ""} ref={sidebarRef}>
        <SidebarLinks>
          <NavLink to="/" onClick={closeSidebar} aria-label="Go to Home">
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeSidebar} aria-label="About Us">
            About Us
          </NavLink>
          <NavLink
            to="/festivals"
            onClick={closeSidebar}
            aria-label="View Festivals"
          >
            Festivals
          </NavLink>
          <NavLink to="#" onClick={handleProfileClick} aria-label="Profile">
            Profile
          </NavLink>
          <NavLink to="#" onClick={handleFavoritesClick} aria-label="Favorites">
            Favorites
          </NavLink>
        </SidebarLinks>
      </Sidebar>
    </NavbarContainer>
  );
};

export default Navbar;
