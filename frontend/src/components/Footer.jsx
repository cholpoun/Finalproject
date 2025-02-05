import styled from "styled-components";

const FooterContainer = styled.footer`
  background: #0349df;
  color: white;
  padding: 40px 10px;
  width: 100%;
  position: relative;
`;

const FooterContent = styled.div`
  margin: 0 auto;
  padding: 0 40px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 100px;
  text-align: left;
  padding-top: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FooterColumn = styled.div`
  p,
  a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
    outline: none;
  }

  a {
    color: #ffd700;
  }

  a:hover,
  a:focus {
    color: #ffcc00;
    text-decoration: underline;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 20px;
  padding-top: 15px;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>NextFest</h2>
        <p>
          Discover the best festivals in Scandinavia with NextFest! Enjoy a wide
          range of events tailored to your taste. Our members always get early
          access to tickets and the best prices.
        </p>
        <FooterGrid>
          <FooterColumn>
            <h3>Join Us!</h3>
            <p>
              Become a member of the largest festival community in Scandinavia
              and enjoy exclusive access to the best festivals across Sweden,
              Norway, Denmark, and Finland.
            </p>
            <a
              href="/users/authenticate"
              aria-label="Login or register now to become a member"
            >
              Login or register now!
            </a>
          </FooterColumn>
          <FooterColumn>
            <h3>Quick Links</h3>
            <p>
              <a href="/about" aria-label="Learn more about NextFest">
                About Us
              </a>
            </p>
            <p>
              <a href="/festivals" aria-label="Explore upcoming festivals">
                Festivals
              </a>
            </p>
            <p>
              <a href="/users/authenticate" aria-label="Join NextFest">
                Join us
              </a>
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
