import React, {useState, useContext, useEffect} from 'react';
import styles  from "../styles/Profile.module.css";
import '../App.css'
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import GithubAuthButton from "../components/GitHubLogin";

const Profile = () => {
    const [isGithubLinked, setIsGithubLinked] = useState(true);

        return (
            <>
                <Navbar/>
                <div className={styles.profileContainer}>
                    {/* Left Profile Section */}
                    <div className={styles.profileLeft}>
                        <div className={styles.profileInfo}>
                            <div className={styles.avatarContainer}>
                                <img
                                    src="https://media.istockphoto.com/id/1485111631/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%B7%D0%B0%D0%B4%D1%83%D0%BC%D1%87%D0%B8%D0%B2%D1%8B%D0%B9-%D0%BD%D0%B5%D0%B3%D1%80.jpg?s=1024x1024&w=is&k=20&c=SN4kjJscyUGdM59TeCXSVxRVVxXsm0fITGmeXnFcW48="
                                    alt="Profile"
                                    className={styles.avatarImage}
                                />
                            </div>

                            <h1 className={styles.profileName}>Иван Иванов</h1>
                            <a href="mailto:ivan@example.com" className={styles.profileEmail}>
                                ivan@example.com
                            </a>

                            <p className={styles.profileDescription}>
                                Опытный разработчик с более чем 5-летним стажем в веб-разработке.
                                Специализируюсь на создании современных веб-приложений.
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className={styles.profileRight}>
                        {/* Top Panel - Always Visible */}
                        <div className={styles.topPanel}>
                            <div className={styles.panelContent}>
                                <h2 className={styles.panelTitle}>Профиль разработчика</h2>
                                {!isGithubLinked ? (
                                    <GithubAuthButton/>
                                ) : (
                                    <div className={styles.githubLinked}>
                                        <svg className={styles.checkIcon} fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                        GitHub привязан
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content that appears after GitHub is linked */}
                        {isGithubLinked && (
                            <div className={styles.fadeIn}>
                                {/* Experience - Full Width */}
                                <div className={styles.fullWidthSection}>
                                    <h2 className={styles.sectionTitle}>Опыт работы</h2>
                                    <div className={styles.contentItem}>
                                        <p className={styles.contentTitle}>Senior Frontend Developer</p>
                                        <p className={styles.contentSubtitle}>Tech Company</p>
                                        <p className={styles.contentDate}>2020 - настоящее время</p>
                                    </div>
                                </div>

                                {/* Three Equal Columns */}
                                <div className={styles.threeColumnGrid}>
                                    <div className={styles.gridCard}>
                                        <h2 className={styles.sectionTitle}>Образование</h2>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>МГУ им. Ломоносова</p>
                                            <p className={styles.contentSubtitle}>Факультет ВМК</p>
                                            <p className={styles.contentDate}>2015 - 2019</p>
                                        </div>
                                    </div>

                                    <div className={styles.gridCard}>
                                        <h2 className={styles.sectionTitle}>Языки</h2>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>Английский</p>
                                            <p className={styles.contentSubtitle}>C1 Advanced</p>
                                        </div>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>Русский</p>
                                            <p className={styles.contentSubtitle}>Родной</p>
                                        </div>
                                    </div>

                                    <div className={styles.gridCard}>
                                        <h2 className={styles.sectionTitle}>Сертификаты</h2>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>AWS Solutions Architect</p>
                                            <p className={styles.contentDate}>2023</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.twoColumnGrid}>
                                    <div className={styles.gridCard}>
                                        <h2 className={styles.sectionTitle}>Образование</h2>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>МГУ им. Ломоносова</p>
                                            <p className={styles.contentSubtitle}>Факультет ВМК</p>
                                            <p className={styles.contentDate}>2015 - 2019</p>
                                        </div>
                                    </div>

                                    <div className={styles.gridCard}>
                                        <h2 className={styles.sectionTitle}>Языки</h2>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>Английский</p>
                                            <p className={styles.contentSubtitle}>C1 Advanced</p>
                                        </div>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>Русский</p>
                                            <p className={styles.contentSubtitle}>Родной</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Footer/>
            </>
        );
};

export default Profile;