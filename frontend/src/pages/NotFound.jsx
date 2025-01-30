// src/pages/NotFound.jsx

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
};

export default NotFound;
