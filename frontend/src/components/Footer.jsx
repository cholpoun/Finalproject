import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a202c;
  color: white;
  padding: 3rem 0;
  position: relative;
  bottom: 0;
  width: 100%;
  margin-top: 3rem;
`;


const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FooterColumn = styled.div`
  h3, h4 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  p, ul, a {
    color: #a0aec0;
    margin-bottom: 0.5rem;
  }

  a:hover {
    color: white;
  }
`;



const FooterBottom = styled.div`
  border-top: 1px solid #2d3748;
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  color: #a0aec0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <h3>FestivalTix</h3>
            <p>Your gateway to Scandinavian festivals</p>
          </FooterColumn>
          <FooterColumn>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/festivals">Festivals</a></li>
              <li><a href="/users/authenticate">Join us</a></li>
            </ul>
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
