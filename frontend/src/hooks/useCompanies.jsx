import { useState, useEffect } from "react";

export default function useCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        console.log("Fetching companies...");

        const fetchPromise = fetch("http://localhost:8082/v1/companies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller.signal
        });

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Request timed out"));
            }, 5000);
        });

        // Гонка между запросом и таймаутом
        Promise.race([fetchPromise, timeoutPromise])
            .then(response => {
                console.log("Response: ", response);

                if (!response.ok) {
                    throw new Error("Ошибка загрузки данных");
                }

                return response.json();
            })
            .then(data => {
                console.log("data: ", data);

                if (data && Array.isArray(data.companies)) {
                    setCompanies(data.companies);
                } else {
                    console.error("Полученные данные не содержат массив companies:", data);
                    setError("Полученные данные не содержат массив companies.");
                }

                setLoading(false);
            })
            .catch(error => {
                if (error.name === 'AbortError') {
                    console.log("Request was aborted");
                } else {
                    console.error("Ошибка запроса:", error);
                    setError(error.message);
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, []);


    return { companies, loading, error };
}
