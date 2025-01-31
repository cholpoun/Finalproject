import AboutUsCard from "../components/AboutUsCard";
import styled from "styled-components";

// Styled-component to ensure the page covers the full screen
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px; // Optional, for some spacing around the content
`;

const AboutUs = () => {
  return (
    <PageContainer>
      <AboutUsCard />
    </PageContainer>
  );
};

export default AboutUs;
