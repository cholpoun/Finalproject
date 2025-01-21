import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FestivalCard from './components/FestivalCard';

const FestivalsPage = () => {
  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}

      <FestivalCard />
      <Footer /> {/* Include the Footer component */}
    </div>
  );
};

export default FestivalsPage;
