import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Heart, User, Menu, X } from 'lucide-react';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(212, 184, 184, 0.9);
  backdrop-filter: blur(10px);
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const NavbarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6b46c1;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none; /* Hide nav links on mobile */
  }
`;

const NavLink = styled(Link)`
  transition: color 0.3s;
  color: inherit;
  text-decoration: none;

  &:hover {
    color: #6b46c1;
  }

  svg {
    margin-right: 0.25rem;
    width: 1.25rem;
    height: 1.25rem;
    display: inline-block;
  }
`;

const NavbarIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-left: auto;
  margin-right: 1.5rem;
`;

const HamburgerMenu = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 4rem;
  right: 0;
  height: 100%;
  width: auto;
  background-color: rgba(212, 184, 184, 0.9);
  z-index: 100;
  transition: transform 0.3s ease-in-out;
  transform: translateX(100%); /* Start the sidebar off-screen */

  &.open {
    transform: translateX(0);
  }
`;

const SidebarLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  background-color: rgba(212, 184, 184, 0.9);
  padding: 1rem;

  & a {
    color: inherit;
    font-size: 1.5rem;
    text-decoration: none;
  }
`;

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <NavbarContainer>
      <NavbarContent>
        <NavLink to="/">
          <Logo>NextFest</Logo>
        </NavLink>

        <NavbarIcons>
          <NavLink to="/profile" aria-label="Profile">
            <User />
          </NavLink>
          <NavLink to="/favorites" aria-label="Favorites">
            <Heart />
          </NavLink>
        </NavbarIcons>

        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/festivals">Festivals</NavLink>
        </NavLinks>

        <HamburgerMenu onClick={toggleSidebar} aria-label="Toggle Menu">
          {isSidebarOpen ? <X /> : <Menu />}
        </HamburgerMenu>
      </NavbarContent>

      <Sidebar className={isSidebarOpen ? 'open' : ''} ref={sidebarRef}>
        <SidebarLinks>
          <NavLink to="/" onClick={closeSidebar}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeSidebar}>
            About Us
          </NavLink>
          <NavLink to="/festivals" onClick={closeSidebar}>
            Festivals
          </NavLink>
        </SidebarLinks>
      </Sidebar>
    </NavbarContainer>
  );
};

export default Navbar;