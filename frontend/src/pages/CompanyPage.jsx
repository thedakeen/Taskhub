import React, {useEffect, useState} from 'react';
import {useParams,Link} from "react-router-dom";
import styles from "../styles/Company.module.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import AnimatedLoader from "../components/AnimatedLoader";

const CompanyInfo = () => {
    const {companyId} = useParams();
    const [companyData, setCompanyData] = useState(null);
    const [issues, setIssues] = useState([]); // Состояние для хранения issues
    const [error, setError] = useState(null);
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCompanyData = async () => {
            setIsLoadingPage(true);
            try {
                const response = await fetch(`http://localhost:8082/v1/companies/${companyId}`);
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }
                const data = await response.json();
                setCompanyData(data);
                setIsLoadingPage(false);

            } catch (err) {
                console.error("Ошибка получения данных компании:", err);
                setError(err.message);
            }
        };

        fetchCompanyData();
    }, [companyId]);

    useEffect(() => {
        const fetchIssues = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8082/v1/companies/${companyId}/issues`);

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }
                const data = await response.json();
                setIssues(data.issues);
                console.log(data);
                setIsLoading(false);
            } catch (err) {
                console.error("Ошибка получения issues:", err);
                setError(err.message);
            }
        };

        fetchIssues();
    }, [companyId]);

    if (error) return <div>Ошибка: {error}</div>;
    if (!companyData) return <div>Загрузка...</div>;

    const createdAt = new Date(companyData.createdAt);
    const formattedDate = createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            <Navbar/>
            <div className={styles.companyContainer}>
                {isLoadingPage ? (
                    <AnimatedLoader
                        isLoading={isLoading}
                        onComplete={() => console.log('Загрузка завершена!')}
                    />
                ) : (
                    <>
                        <h2 className={styles.companyName}>{companyData.companyName}</h2>
                        <div className={styles.companyContentContainer}>
                            <div className={styles.left}>
                                <h3>Company Info</h3>
                                <div className={styles.avatarContainer}>
                                    <img
                                        src={companyData.logo}
                                        alt="Company Logo"
                                        className={styles.avatarImage}
                                    />
                                </div>
                                <div className={styles.websiteLink}>
                                    <span className={styles.statLabel}>Website:</span>
                                    <a href={companyData.websiteUrl}
                                       className={styles.statValue}>{companyData.websiteUrl}</a>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <h3>About Company</h3>
                                <div className={styles.descriptionBlock}>
                                    <div className={styles.descriptionItem}>
                                        <span className={styles.descriptionLabel}>Work with us since:</span>
                                        <span className={styles.descriptionValue}>{formattedDate}</span>
                                    </div>
                                    <div className={styles.aboutText}>
                                        <p>{companyData.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.companyContentContainer}>
                            {/* Секция задач слева */}
                            <div className={styles.issuesSection}>
                                <h3>Tasks</h3>
                                {isLoading ? (
                                    <AnimatedLoader
                                        isLoading={isLoading}
                                        onComplete={() => console.log('Загрузка завершена!')}
                                    />
                                ) : (
                                    <ol className={styles.issuesList}>
                                        {issues.map((issue, index) => (
                                            <li key={index} className={index % 2 === 0 ? styles.even : styles.odd}>
                                                <Link to={`/issues/${issue.issueId}`} className={styles.issueItem}>
                                                    <span className={styles.issueTitle}>{issue.title}</span>
                                                    <span
                                                        className={styles.devsCount}>{issue.developers?.length || 0} devs</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ol>)}
                            </div>


                            <div className={styles.statsSection}>
                                <h3>Company Stats</h3>
                                <div className={styles.statBlock}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Total tasks:</span>
                                        <span className={styles.statValue}>{issues.length}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Active projects:</span>
                                        <span className={styles.statValue}>{issues.length}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Team members:</span>
                                        <span className={styles.statValue}>1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
            <Footer/>
        </>
    );
};

export default CompanyInfo;