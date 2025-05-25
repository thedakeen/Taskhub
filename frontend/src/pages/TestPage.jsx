import React, {useContext, useEffect, useRef, useState} from 'react';
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import styles from '../styles/Home.module.css'; // Импорт CSS-модуля
import { Link } from "react-router-dom";
import CompanyCard from "../components/CompanyCard/CompanyCard";
import useCompanies from "../hooks/useCompanies";
import AuthContext from "../contexts/AuthContext";

const Test = () => {
    const { user } = useContext(AuthContext);
    const [num, setNum] = useState([]);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8091/api/top-rating/developers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }
                const data = await response.json();
                setNum(data);
                console.log(data)

            } catch (err) {
                console.error("Ошибка получения профиля:", err);
            }
        };

        fetchProfile();
    }, []);
    return (
        <>
            <Navbar/>
            <Footer/>
        </>
    );
};
export default Test;
