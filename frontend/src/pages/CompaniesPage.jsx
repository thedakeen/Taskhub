import React, {useContext} from "react";
import CompanyCard from "../components/CompanyCard/CompanyCard";
import styles from "../styles/CompanyPage.module.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import useCompanies from "../hooks/useCompanies";
import AnimatedLoader from "../components/AnimatedLoader";
import {I18nContext} from "../contexts/i18nContext";


export default function CompaniesPage() {
    const { companies, loading, error } = useCompanies();
    const { t } = useContext(I18nContext);

    return (
        <>
            <Navbar />
            <div className={styles.companyPageContainer}>
                <h1 className={styles.pageTitle}>{t('companies_we_collaborate_with')}</h1>
                {loading?(
                    <AnimatedLoader
                        isLoading={loading}
                        onComplete={() => console.log('Загрузка завершена!')}
                    />
                ): (
                    <div className={styles.companyGrid}>
                        {companies.map((company, index) => (
                            <CompanyCard key={company.id || index} company={company}/>
                        ))}
                    </div>
                )}

            </div>
            <Footer/>
        </>
    );
}


