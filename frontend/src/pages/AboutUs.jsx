import AboutUsCard from "../components/AboutUsCard";
import styled from "styled-components";

const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
`;

const AboutUs = () => {
  return (
    <PageContainer aria-labelledby="about-us-heading">
      <AboutUsCard />
    </PageContainer>
  );
};

export default AboutUs;
