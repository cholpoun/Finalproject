import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import FestivalDetails from "../pages/FestivalDetailsPage.jsx";
import TicketPage from "../pages/TicketPage.jsx";
import AllFestivals from "../pages/AllFestivalsPage.jsx";

const AppRoutes = () => (
  <Routes>

    <Route path="/" element={<HomePage />} /> 

    <Route path="/festivals/:id" element={<FestivalDetails />} />

    <Route path="/festivals" element={<AllFestivals />} />

    <Route path="/ticket/:festivalId" element={<TicketPage />} />

  </Routes>
);

export default AppRoutes;
