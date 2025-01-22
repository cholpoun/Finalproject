import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import FestivalPage from "../pages/FestivalPage";
import TicketPage from "../pages/TicketPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} /> 
    <Route path="/festival/:id" element={<FestivalPage />} />
    <Route path="/ticket/:festivalId" element={<TicketPage />} />
  </Routes>
);

export default AppRoutes;
