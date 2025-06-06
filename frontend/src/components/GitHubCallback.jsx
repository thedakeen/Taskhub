import React, {useContext, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import {I18nContext} from "../contexts/i18nContext";

const GitHubCallback = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isRequestSent = useRef(false);
    const { t } = useContext(I18nContext);

    useEffect(() => {
        if (isRequestSent.current) return; 
        isRequestSent.current = true; 

        const query = new URLSearchParams(window.location.search);
        const githubCode = query.get("code");

        console.log("🔹 GitHub Code:", githubCode);

        if (githubCode) {
            const authToken = localStorage.getItem("authToken");
            console.log("🔹 Токен перед отправкой запроса:", authToken);

            axios
                .post(
                    "http://localhost:8081/v1/profile/github",
                    { githubCode },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            Authorization: authToken ? `Bearer ${authToken}` : "",
                        },
                    }
                )
                .then((response) => {
                    console.log("✅ Успешный ответ:", response.data);
                    alert(response.data.message);
                    navigate(`/profile/${user.id}`);
                })
                .catch((error) => {
                    if (error.response) {
                        console.error("❌ Ошибка от сервера:", error.response.status, error.response.data);
                        alert(`Ошибка: ${error.response.status} - ${error.response.data.message || "Неизвестная ошибка"}`);
                    } else if (error.request) {
                        console.error("⚠️ Нет ответа от сервера:", error.request);
                        alert("Сервер не отвечает. Попробуйте позже.");
                    } else {
                        console.error("🚨 Ошибка при отправке запроса:", error.message);
                        alert("Ошибка при отправке запроса.");
                    }
                    navigate("/");
                });
        } else {
            alert("GitHub authorization failed.");
            navigate("/");
        }
    }, [navigate]);

    return <p>{t("processing_github_auth")}</p>;
};

export default GitHubCallback;
