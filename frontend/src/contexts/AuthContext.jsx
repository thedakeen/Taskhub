import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // ✅ Флаг загрузки состояния
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const API_BASE_URL = "http://localhost:8081";

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const email = localStorage.getItem("userEmail");
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded) {
                const userId = decoded.uid;
                setUser({ token, id: userId, email });
                console.log("User loaded:", { id: userId, email });
            }
        }
        setIsLoading(false); // ✅ Завершаем загрузку
    }, []);

    const logIn = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/v1/login`, { email, password });
            const { token } = response.data;
            if (token) {
                const decoded = decodeJWT(token);
                localStorage.setItem("authToken", token);
                localStorage.setItem("userEmail", email);
                setUser({ token, id: decoded?.uid, email });
            } else {
                console.error("❌ В ответе от сервера нет токена:", response.data);
            }
        } catch (error) {
            console.error("SignIn failed. Error details:", error.response?.data || error.message);
            alert("SignIn failed! Please check your credentials.");
        }
    };

    const signUp = async (email, password, username) => {
        try {
            await axios.post(`${API_BASE_URL}/v1/signup`, { email, password, username });
            setVerificationCodeSent(true);
            alert("Code sent to your email. Please check your inbox.");
        } catch (error) {
            console.error("SignUp failed. Error details:", error.response?.data || error.message);
            alert("SignUp failed! Please try again.");
        }
    };

    const verifyCode = async (OTP, email) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/v1/signup/confirm`, { email, otp: OTP });
            const { token } = response.data;
            if (token) {
                localStorage.setItem("authToken", token);
                localStorage.setItem("userEmail", email);
                setUser({ token, email });
            }
            alert("Verification successful. You are now logged in.");
        } catch (error) {
            console.error("Verification failed. Error details:", error.response?.data || error.message);
            alert("Verification failed. Please try again.");
        }
    };

    const logOut = () => {
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        console.log("User logged out and token cleared.");
    };

    const decodeJWT = (token) => {
        try {
            const payload = token.split(".")[1];
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (error) {
            console.error("Ошибка при декодировании JWT:", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logIn, logOut, signUp, verifyCode, verificationCodeSent }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
