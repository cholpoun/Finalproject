import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import FestivalDetails from "../pages/FestivalDetailsPage.jsx";
import TicketPage from "../pages/TicketPage.jsx";
import AllFestivals from "../pages/AllFestivalsPage.jsx";
import AuthPage from "../pages/AuthPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} /> 

    <Route path="/festivals/:id" element={<FestivalDetails />} />

    <Route path="/festivals" element={<AllFestivals />} />

    <Route path="/auth" element={<AuthPage />} /> 

    <Route path="/profile" element={<ProfilePage />} />


    <Route path="/ticket/:festivalId" element={<TicketPage />} />

    {/* <Route path="/login" element={<LoginSignUp />} /> Add the LoginSignUp route */}
  </Routes>
);

export default AppRoutes;
