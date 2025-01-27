import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import FestivalDetails from "../pages/FestivalDetailsPage.jsx";
import AllFestivals from "../pages/AllFestivalsPage.jsx";
import AuthPage from "../pages/AuthPage.jsx";
import Profile from "../pages/UserProfilePage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx"; 

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} /> 

    <Route path="/festivals/:id" element={<FestivalDetails />} />

    <Route path="/festivals" element={<AllFestivals />} />

    <Route path="/users/authenticate" element={<AuthPage />} /> 

    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } 
    />
  </Routes>
);

export default AppRoutes;
