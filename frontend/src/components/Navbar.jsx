import styled from 'styled-components';
import { Heart, User } from 'lucide-react';

const NavbarContainer = styled.nav`
  position: top;
  top: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
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
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`;

const NavLink = styled.a`
  transition: color 0.3s;
  color: inherit;

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


const Navbar = () => {
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo>FestivalTix</Logo>

        <NavLinks>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/festivals">Festivals</NavLink>
          <NavLink href="/profile">
            <User /> Profile
          </NavLink>
          <NavLink href="/favorites">
            <Heart /> Favorites
          </NavLink>
        </NavLinks>

    
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
