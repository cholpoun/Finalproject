import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import FestivalId from "../pages/FestivalId.jsx";
import TicketPage from "../pages/TicketPage.jsx";
import FestivalsPage from "../components/FestivalsPage.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} /> 
    <Route path="/festival/:id" element={<FestivalId />} />
    <Route path="/festivals" element={<FestivalsPage />} />

    <Route path="/ticket/:festivalId" element={<TicketPage />} />
  </Routes>
);

export default AppRoutes;
