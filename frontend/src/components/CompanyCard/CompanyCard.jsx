import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CompanyCard.module.css";

export default function CompanyCard({ company }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/companies/${company.companyId}`);
    };

    return (
        <div className={styles.companyCard} onClick={handleClick}>
            <div className={styles.logoContainer}>
                <img
                    src={company.logo}
                    alt={company.companyName}
                    className={styles.companyImage}
                />
            </div>
            <div className={styles.companyInfo}>
                <h3 className={styles.companyName}>{company.companyName}</h3>
                {company.description && (
                    <p className={styles.companyDescription}>{company.description}</p>
                )}
            </div>
        </div>
    );
}