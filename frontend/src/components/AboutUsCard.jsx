const AboutUsCard = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>About Us</h2>
        <p style={styles.description}>
          We are a team of passionate individuals dedicated to providing you with the best experience. Our mission is to make your life easier and more enjoyable through our innovative solutions.
        </p>

        <div style={styles.columns}>
          {/* Column 1 */}
          <div style={styles.column}>
            <img
              src="https://media.licdn.com/dms/image/v2/D4E03AQGldh7m-J00pw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711381838628?e=1743638400&v=beta&t=ZlKi8TVwgFkbdTKDDdfGEHuilSX9cMH_lB-5ITV6DE4"
              alt="Team"
              style={styles.image}
            />
            <h3 style={styles.subHeading}>Our Team</h3>
            <p style={styles.text}>
              Meet our talented team of professionals who are passionate about what they do.
            </p>
          </div>

          {/* Column 2 */}
          <div style={styles.column}>
            <img
              src="https://media.licdn.com/dms/image/v2/D4D03AQEDlUvCLFPr2w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723646065626?e=1743638400&v=beta&t=7L3cH081ym7SECyLyTBvJ2-Mq9xcDJapFkdlkIf1Jno"
              alt="Mission"
              style={styles.image}
            />
            <h3 style={styles.subHeading}>Our Mission</h3>
            <p style={styles.text}>
              We strive to deliver innovative solutions that make a difference in your life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center', // Horizontally center
    alignItems: 'center', // Vertically center
    height: '100vh', // Full viewport height
    backgroundColor: '#121212', // Optional: Add a background color to contrast with the card
  },
  card: {
    backgroundColor: 'black',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(238, 229, 229, 0.1)',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    color: 'white',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  columns: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
  },
  column: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
  subHeading: {
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  text: {
    fontSize: '1rem',
    lineHeight: '1.5',
  },
};

export default AboutUsCard;
