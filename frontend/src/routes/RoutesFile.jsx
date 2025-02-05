import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Layout from "../components/Layout.jsx";

const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const FestivalDetailsPage = lazy(() =>
  import("../pages/FestivalDetailsPage.jsx")
);
const AllFestivals = lazy(() => import("../pages/AllFestivalsPage.jsx"));
const AuthPage = lazy(() => import("../pages/AuthPage.jsx"));
const Profile = lazy(() => import("../pages/UserProfilePage.jsx"));
const AboutUs = lazy(() => import("../pages/AboutUs.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/festivals" element={<AllFestivals />} />
        <Route path="/festivals/:id" element={<FestivalDetailsPage />} />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Sidor utan Navbar/Footer */}
      <Route path="/users/authenticate" element={<AuthPage />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
