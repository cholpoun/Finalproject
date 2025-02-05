import styled from "styled-components";
const HeroContainer = styled.div`
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 0 1rem;
`;

const HeroHeading = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const HeroParagraph = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Hero = () => {
  return (
    <HeroContainer>
      <HeroBackground />
      <HeroOverlay />
      <HeroContent>
        <HeroHeading>Experience the Magic of Nordic Festivals</HeroHeading>
        <HeroParagraph>
          Discover and book tickets to the most exciting Scandinavian festivals
        </HeroParagraph>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
