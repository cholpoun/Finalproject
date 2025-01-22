// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Hero from './components/Hero';
// import FestivalCard from './components/FestivalCard';
// import AboutUsCard from './components/AboutUsCard';


// const App = () => {
//   return (
//     <div>
//       <Navbar /> {/* Include the Navbar component */}

//       <Hero /> {/* Include the Hero component */}

//       <FestivalCard />
//       <AboutUsCard />

//       <Footer /> {/* Include the Footer component */}
//     </div>
//   );
// };

// export default App;

// src/App.jsx

import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/RoutesFile";

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
