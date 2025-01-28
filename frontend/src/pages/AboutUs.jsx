import Navbar from "../components/Navbar"; // Corrected import path
import Footer from "../components/Footer";
import AboutUsCard from "../components/AboutUsCard";

const AboutUs = () => {
  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}
      <AboutUsCard /> {/* Include the AboutUsCard component */}
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default AboutUs;