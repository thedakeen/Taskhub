import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SingIn";
import SignUp from "../pages/SignUp";
import Verification from "../pages/Verification";
import Profile from "../pages/Profile";
import AuthContext from "../contexts/AuthContext";
import GitHubCallback from "../components/GitHubCallback";
import CompaniesPage from "../pages/CompaniesPage";
import CompanyInfo from "../pages/CompanyPage";

export function AppRoutes() {
    const { user } = useContext(AuthContext);

    const publicRoutes = [
        { path: "/", element: <Home /> },
        { path: "/signin", element: <SignIn /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/signup/verification", element: <Verification /> },
        { path: "/github/callback", element: <GitHubCallback /> },
    ];

    const privateRoutes = [
        { path: "/profile/:developerID", element: <Profile /> },
        { path: "/companies", element: <CompaniesPage /> },
        { path: "/companies/:companyId", element: <CompanyInfo /> },
    ];

    return (
        <Routes>
            {/* Public routes */}
            {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}


            {/* Private routes */}
            {privateRoutes.map(({ path, element }) => (
                <Route
                    key={path}
                    path={path}
                    element={user ? element : <Navigate to="/signin" replace />}
                />
            ))}

            {/* Fallback route */}
            <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
    );
}
