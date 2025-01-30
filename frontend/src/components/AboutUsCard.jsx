import styled from "styled-components";

const AboutUsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #d85a94 0%, #145a7a 100%);
  padding: 40px 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  text-align: center;
  color: #333;
  font-family: "Quicksand", sans-serif;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #d85a94;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const Column = styled.div`
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const SubHeading = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #145a7a;
`;

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

const AboutUsCard = () => {
  return (
    <AboutUsContainer>
      <Card>
        <Heading>About Us</Heading>
        <Description>
          We are a duo of enthusiastic developers who&apos;ve completed the
          Technigo Web Dev Bootcamp. Together, we&apos;re an easy-breezy team,
          solving problems and creating seamless experiences with a
          collaborative spirit. Our mission is to make your digital journey
          smooth and enjoyable, one solution at a time.
        </Description>

        <Columns>
          <Column>
            <Image
              src="https://media.licdn.com/dms/image/v2/D4E03AQGldh7m-J00pw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711381838628?e=1743638400&v=beta&t=ZlKi8TVwgFkbdTKDDdfGEHuilSX9cMH_lB-5ITV6DE4"
              alt="Team"
            />
            <SubHeading>Nella</SubHeading>
            <Text>
              Nella is a Junior Developer with a background in administration
              and education. With a natural curiosity and strong problem-solving
              skills, she creates user-centered digital solutions that spark
              innovation and efficiency. 💻✨
            </Text>
          </Column>

          <Column>
            <Image
              src="https://media.licdn.com/dms/image/v2/D4D03AQEDlUvCLFPr2w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723646065626?e=1743638400&v=beta&t=7L3cH081ym7SECyLyTBvJ2-Mq9xcDJapFkdlkIf1Jno"
              alt="Mission"
            />
            <SubHeading>Cholpon</SubHeading>
            <Text>
              {" "}
              Cholpon is a Junior Developer with a background in **marketing and
              product marketing**. She combines technical skills with strategic
              thinking to build user-friendly solutions while leveraging her
              expertise in branding and market analysis. 🚀
            </Text>
          </Column>
        </Columns>
      </Card>
    </AboutUsContainer>
  );
};

export default AboutUsCard;
