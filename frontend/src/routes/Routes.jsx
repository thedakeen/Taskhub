import React, { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import Home from "../pages/Home";
import SignIn from "../pages/SingIn";
import SignUp from "../pages/SignUp";
import Verification from "../pages/Verification";
import Profile from "../pages/Profile";
import GitHubCallback from "../components/GitHubCallback";
import CompaniesPage from "../pages/CompaniesPage";
import CompanyInfo from "../pages/CompanyPage";
import CompanyIssue from "../pages/Issue";
import AdminPanel from "../pages/AdminPanel";


import AuthContext from "../contexts/AuthContext";
import ErrorHandler from "../components/ErrorHandler";
import AnimatedLoader from "../components/AnimatedLoader";
import ProtectedRoute from "./ProtectedRoute"; 

export function AppRoutes() {
    const { user, isLoading } = useContext(AuthContext);
    const [error, setError] = useState(null);

    if (isLoading) {
        return (
            <AnimatedLoader
                isLoading={isLoading}
                onComplete={() => console.log("loaded")}
            />
        );
    }

    return (
        <>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signup/verification" element={<Verification />} />
                <Route path="/github/callback" element={<GitHubCallback />} />
                <Route path="/issues/:issueId" element={<CompanyIssue />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/companies/:companyId" element={<CompanyInfo />} />
                {/*<Route path="/profile" element={<Home />} />*/}

                {/* Private routes with ProtectedRoute */}
                <Route
                    path="/profile/:developerID"
                    element={
                        <ProtectedRoute user={user} setError={setError}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                {/* Fallback */}
                <Route path="*" element={<h1>Page Not Found</h1>} />
            </Routes>

            {/* Global Error Modal */}
            <ErrorHandler
                error={error}
                onClose={() => setError(null)}
                isModal={true}
            />
        </>
    );
}
