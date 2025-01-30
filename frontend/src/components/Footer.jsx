import styled from "styled-components";

const FooterContainer = styled.footer`
  background: #176b91;
  backdrop-filter: blur(15px);
  color: white;
  padding: 3rem 1rem;
  width: 100%;
  border-radius: 12px 12px 0 0;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    text-align: left;
  }
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1rem;
    font-family: "Poppins", sans-serif;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
    font-family: "Quicksand", sans-serif;
  }

  p, a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
  }

  a:hover {
    color: #ffd700;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 2rem;
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>FestivalTix</h3>
        <FooterGrid>
          <FooterColumn>
            <h4>Quick Links</h4>
            <p><a href="/about">About Us</a></p>
            <p><a href="/festivals">Festivals</a></p>
            <p><a href="/users/authenticate">Join us</a></p>
          </FooterColumn>
          <FooterColumn>
            <h4>Join Us!</h4>
            <p>Be part of the biggest festival community in Scandinavia</p>
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
