import styled from "styled-components";

const FooterContainer = styled.footer`
  background: #176b91;
  color: white;
  padding: 3rem 1rem;
  width: 100%;
  border-radius: 12px 12px 0 0;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const FooterContent = styled.div`
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  text-align: center;
  justify-items: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    text-align: left;
  }
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 1.75rem;
    }

    @media (min-width: 1024px) {
      font-size: 2rem;
    }
  }

  h4 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.75rem;
    }
  }

  p,
  a {
    font-size: 1rem;
    color: white;
    text-decoration: none;
    transition: color 0.3s;

    @media (min-width: 768px) {
      font-size: 1.1rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.2rem;
    }
  }

  a {
    color: #ffd700;
  }

  a:hover {
    color: #ffcc00;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 2rem;
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.1rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>NextFest</h3>
        <p>
          Discover the best festivals in Scandinavia with NextFest! Enjoy a wide
          range of events tailored to your taste. Our members always get early
          access to tickets and the best prices.
        </p>
        <FooterGrid>
          <FooterColumn>
            <h4>Join Us!</h4>
            <p>
              Become a member of the largest festival community in Scandinavia
              and enjoy exclusive access to the best festivals across Sweden,
              Norway, Denmark, and Finland.
            </p>
            <a href="/users/authenticate">Login or register now!</a>
          </FooterColumn>
          <FooterColumn>
            <h4>Quick Links</h4>
            <p>
              <a href="/about">About Us</a>
            </p>
            <p>
              <a href="/festivals">Festivals</a>
            </p>
            <p>
              <a href="/users/authenticate">Join us</a>
            </p>
          </FooterColumn>
        </FooterGrid>
        <FooterBottom>
          <p>&copy; 2025 NextFest. All rights reserved.</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
