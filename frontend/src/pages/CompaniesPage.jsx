import React, {useEffect, useState} from "react";
import CompanyCard from "../components/CompanyCard/CompanyCard";
import styles from "../styles/CompanyPage.module.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import useCompanies from "../hooks/useCompanies";
import AnimatedLoader from "../components/AnimatedLoader";


export default function CompaniesPage() {
    const { companies, loading, error } = useCompanies();
    const dataToShow =  companies;

    console.log("dataToShow:", dataToShow); // Добавить лог для проверки данных

    return (
        <>
            <Navbar />
            <div className={styles.companyPageContainer}>
                <h1 className={styles.pageTitle}>Companies we collaborate with</h1>
                {loading?(
                    <AnimatedLoader
                        isLoading={loading}
                        onComplete={() => console.log('Загрузка завершена!')}
                    />
                ): (
                    <div className={styles.companyGrid}>
                        {dataToShow.map((company, index) => (
                            <CompanyCard key={company.id || index} company={company}/>
                        ))}
                    </div>
                )}

            </div>
            <Footer/>
        </>
    );
}


