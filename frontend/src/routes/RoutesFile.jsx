import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Lazy-loaded components
const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const FestivalDetails = lazy(() => import("../pages/FestivalDetailsPage.jsx"));
const AllFestivals = lazy(() => import("../pages/AllFestivalsPage.jsx"));
const AuthPage = lazy(() => import("../pages/AuthPage.jsx"));
const Profile = lazy(() => import("../pages/UserProfilePage.jsx"));
const AboutUs = lazy(() => import("../pages/AboutUs.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx")); // Ensure this path is correct

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/festivals" element={<AllFestivals />} />
      <Route path="/festivals/:id" element={<FestivalDetails />} />
      <Route path="/users/authenticate" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route
        path="/users/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;