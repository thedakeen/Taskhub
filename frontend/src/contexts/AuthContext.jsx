import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const API_BASE_URL = "http://localhost:8081";

    // Загружаем токен при запуске
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded) {
                const userId = decoded.uid; // ✅ Достаем userId сразу
                setUser({ token, id: userId });
                console.log("User loaded:", userId);
            }
        }
    }, []);
    // Функция логина
    const logIn = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/v1/login`, { email, password });
            const { token } = response.data;
            if (token) {
                const decoded = decodeJWT(token);
                setUser({ token, id: decoded?.uid });
                localStorage.setItem("authToken", token);
            } else {
                console.error("❌ В ответе от сервера нет токена:", response.data);
            }
        } catch (error) {
            console.error("SignIn failed. Error details:", error.response?.data || error.message);
            alert("SignIn failed! Please check your credentials.");
        }
    };


    const decodeJWT = (token) => {
        try {
            const payload = token.split(".")[1]; // Берём вторую часть
            const decoded = JSON.parse(atob(payload)); // Декодируем Base64
            return decoded;
        } catch (error) {
            console.error("Ошибка при декодировании JWT:", error);
            return null;
        }
    };
    // Функция регистрации
    const signUp = async (email, password, username) => {
        console.log("Attempting to sign up with:", { email, password, username });

        try {
            await axios.post(`${API_BASE_URL}/v1/signup`, { email, password, username });
            setVerificationCodeSent(true);
            alert("Code sent to your email. Please check your inbox.");
        } catch (error) {
            console.error("SignUp failed. Error details:", error.response?.data || error.message);
            alert("SignUp failed! Please try again.");
        }
    };

    // Функция верификации кода
    const verifyCode = async (OTP, email) => {
        console.log("Attempting to verify OTP:", { OTP, email });

        try {
            const response = await axios.post(`${API_BASE_URL}/v1/signup/confirm`, { email, otp: OTP });

            console.log("Verification response received:", response.data);
            const { token } = response.data;

            if (token) {
                localStorage.setItem("authToken", token);
                setUser({ token });
            }

            alert("Verification successful. You are now logged in.");
        } catch (error) {
            console.error("Verification failed. Error details:", error.response?.data || error.message);
            alert("Verification failed. Please try again.");
        }
    };

    // Функция выхода
    const logOut = () => {
        console.log("Logging out user");
        setUser(null);
        localStorage.removeItem("authToken");
        console.log("User logged out and token cleared.");
    };

    return (
        <AuthContext.Provider value={{
            user,
            logIn,
            logOut,
            signUp,
            verifyCode,
            verificationCodeSent,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
