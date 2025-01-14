import Navbar from './components/Navbar'; // Correct relative path to Navbar
import Footer from './components/Footer'; // Correct relative path to Footer
import Hero from './components/Hero'; // Correct relative path to Hero

const App = () => {
  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}
      
      <Hero /> {/* Include the Hero component */}
      

      {/* Other components and content */}
      
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default App;
