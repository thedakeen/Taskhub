import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import styles from "../styles/Company.module.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import AnimatedLoader from "../components/AnimatedLoader";
import { I18nContext } from "../contexts/i18nContext";

const CompanyInfo = () => {
    const { companyId } = useParams();
    const [companyData, setCompanyData] = useState(null);
    const [issues, setIssues] = useState([]);
    const [error, setError] = useState(null);
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useContext(I18nContext);

    useEffect(() => {
        const fetchCompanyData = async () => {
            setIsLoadingPage(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_COMPANY_SERVICE_API_URL}/v1/companies/${companyId}`);
                if (!response.ok) {
                    throw new Error(`${t('error')} ${response.status}`);
                }
                const data = await response.json();
                setCompanyData(data);
                setIsLoadingPage(false);
            } catch (err) {
                console.error(t('error'), err);
                setError(err.message);
            }
        };
        fetchCompanyData();
    }, [companyId, t]);

    useEffect(() => {
        const fetchIssues = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_COMPANY_SERVICE_API_URL}/v1/companies/${companyId}/issues`);
                if (!response.ok) {
                    throw new Error(`${t('error')} ${response.status}`);
                }
                const data = await response.json();
                setIssues(data.issues);
                setIsLoading(false);
            } catch (err) {
                console.error(t('error'), err);
                setError(err.message);
            }
        };
        fetchIssues();
    }, [companyId, t]);

    if (error) return <div>{t('error')} {error}</div>;
    if (!companyData) return <div>{t('loading')}</div>;

    const createdAt = new Date(companyData.createdAt);
    const formattedDate = createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            <Navbar />
            <div className={styles.companyContainer}>
                {isLoadingPage ? (
                    <AnimatedLoader
                        isLoading={isLoading}
                        onComplete={() => console.log(t('loading') + ' завершена!')}
                    />
                ) : (
                    <>
                        <h2 className={styles.companyName}>{companyData.companyName}</h2>
                        <div className={styles.companyContentContainer}>
                            <div className={styles.left}>
                                <h3>{t('company_info')}</h3>
                                <div className={styles.avatarContainer}>
                                    <img
                                        src={companyData.logo}
                                        alt="Company Logo"
                                        className={styles.avatarImage}
                                    />
                                </div>
                                <div className={styles.websiteLink}>
                                    <span className={styles.statLabel}>Website:</span>
                                    <a href={companyData.websiteUrl} className={styles.statValue}>
                                        {companyData.websiteUrl}
                                    </a>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <h3>{t('about_company')}</h3>
                                <div className={styles.descriptionBlock}>
                                    <div className={styles.descriptionItem}>
                                        <span className={styles.descriptionLabel}>{t('work_with_us_since')}</span>
                                        <span className={styles.descriptionValue}>{formattedDate}</span>
                                    </div>
                                    <div className={styles.aboutText}>
                                        <p>{companyData.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.companyContentContainer}>
                            <div className={styles.issuesSection}>
                                <h3>{t('tasks')}</h3>
                                {isLoading ? (
                                    <AnimatedLoader
                                        isLoading={isLoading}
                                        onComplete={() => console.log(t('loading') + ' завершена!')}
                                    />
                                ) : (
                                    <ol className={styles.issuesList}>
                                        {issues.map((issue, index) => (
                                            <li
                                                key={index}
                                                className={index % 2 === 0 ? styles.even : styles.odd}
                                            >
                                                <Link to={`/issues/${issue.issueId}`} className={styles.issueItem}>
                                                    <span className={styles.issueTitle}>{issue.title}</span>
                                                    <span className={styles.devsCount}>
                            {issue.developers?.length || 0} {t('devs')}
                          </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                            <div className={styles.statsSection}>
                                <h3>{t('company_stats')}</h3>
                                <div className={styles.statBlock}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>{t('total_tasks')}</span>
                                        <span className={styles.statValue}>{issues.length}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>{t('active_projects')}</span>
                                        <span className={styles.statValue}>{issues.length}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>{t('team_members')}</span>
                                        <span className={styles.statValue}>1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CompanyInfo;
