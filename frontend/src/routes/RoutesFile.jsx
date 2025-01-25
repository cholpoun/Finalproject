import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import FestivalDetails from "../pages/FestivalDetailsPage.jsx";
import TicketPage from "../pages/TicketPage.jsx";
import AllFestivals from "../pages/AllFestivalsPage.jsx";
// import LoginSignUp from "../pages/LoginSignUp.jsx"; // Import the LoginSignUp component

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} /> 

    <Route path="/festivals/:id" element={<FestivalDetails />} />

    <Route path="/festivals" element={<AllFestivals />} />

    <Route path="/ticket/:festivalId" element={<TicketPage />} />

    {/* <Route path="/login" element={<LoginSignUp />} /> Add the LoginSignUp route */}
  </Routes>
);

export default AppRoutes;
