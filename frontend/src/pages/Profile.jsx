import React, { useState, useEffect, useContext } from 'react';
import styles from "../styles/Profile.module.css";
import '../App.css';
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import GithubAuthButton from "../components/GitHubLogin";
import AuthContext from "../contexts/AuthContext";
import {Link} from "react-router-dom";
import { Modal, Button } from 'antd';
import AnimatedLoader from "../components/AnimatedLoader";
import {I18nContext} from "../contexts/i18nContext";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [isGithubLinked, setIsGithubLinked] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [tasksInProgress, setTasksInProgress] = useState({ tasks: [] });
    const [completedTasks, setCompletedTasks] = useState({ tasks: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const { t } = useContext(I18nContext);

    const showModal = (solution) => {
        setSelectedSolution(solution);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_AUTH_SERVICE_API_URL}/v1/profile/${String(user.id)}`);
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }
                const data = await response.json();
                setProfileData(data);
                setIsGithubLinked(data.isGithubLinked);
            } catch (err) {
                console.error("Ошибка получения профиля:", err);
                setError(err.message);
            }
        };

        fetchProfile();
    }, [user.id]);

    useEffect(() => {
        const fetchTasksInProgress = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_COMPANY_SERVICE_API_URL}/v1/developers/${user.id}/tasks/in-progress`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();
                console.log("Tasks data:", data);

                
                setTasksInProgress(data.tasks ? { tasks: data.tasks } : { tasks: [] });
            } catch (err) {
                console.error("Ошибка получения задач:", err);
                setTasksInProgress({ tasks: [] });
            }
        };

        fetchTasksInProgress();
    }, [user.id, user?.token]);

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_COMPANY_SERVICE_API_URL}/v1/developers/${user.id}/solutions`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();
                setCompletedTasks(data.solutions ? { solutions: data.solutions } : { solutions: [] });
                console.log("completed task data from server:", data.solutions); 

            } catch (err) {
                console.error("Ошибка получения задач:", err);
                setCompletedTasks({ solutions: [] });
            }
        };

        fetchCompletedTasks();

    }, [user.id, user?.token]);


    if (!profileData) return <div>Загрузка...</div>;



    const checkedSolutions = completedTasks?.solutions?.filter(
        solution => solution.rating !== null && solution.rating !== undefined && solution.status === 'checked'
    ) || [];

    const averageRating = checkedSolutions.length > 0
        ? checkedSolutions.reduce((sum, solution) => {
        console.log(solution.rating + " rating");
        console.log(sum + " sum");
        return sum + solution.rating;
    }, 0) / checkedSolutions.length
        : null;



    const StarRating = ({ rating, size = 12 }) => (
        <div style={{display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px'}}>
        <span style={{fontSize: '1.5rem', letterSpacing: '1px'}}>
          {Array.from({length: 5}, (_, i) => (
              <span
                  key={i}
                  style={{color: i < Math.floor(rating) ? '#fadb14' : '#ccc'}}
              >
                  {i < Math.round(rating) ? '★' : '☆'}
              </span>
          ))}
        </span>
            <span style={{fontSize: '1rem', fontWeight: 'bold'}}>
                {rating.toFixed(1)}
        </span>
        </div>
    );

    return (
        <>
            <Navbar />
            {!user ? (
                <AnimatedLoader
                    isLoading={!user}
                    onComplete={() => console.log(t('loadingComplete'))}
                />
            ) : (
                <>
                    <div className={styles.profileContainer}>
                        <div className={styles.profileLeft}>
                            <div className={styles.profileInfo}>
                                <div className={styles.avatarContainer}>
                                    {profileData.avatarUrl ? (
                                        <img
                                            src={profileData.avatarUrl}
                                            alt={t('profileImageAlt')}
                                            className={styles.avatarImage}
                                        />
                                    ) : (
                                        <svg
                                            width="200px"
                                            height="200px"
                                            viewBox="0 0 16 16"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0"
                                                fill="#2e3436"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <h1 className={styles.profileName}>{profileData.username}</h1>
                                <a href={`mailto:${profileData.email}`} className={styles.profileEmail}>
                                    {profileData.email}
                                </a>
                                <p className={styles.profileDescription}>
                                    {profileData.bio || t('noDescription')}
                                </p>
                                {profileData.cvUrl && (
                                    <a
                                        href={profileData.cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.cvLink}
                                    >
                                        {t('openCV')}
                                    </a>
                                )}
                            </div>
                        </div>
                        {/* Правая часть профиля */}
                        <div className={styles.profileRight}>
                            <div className={styles.topPanel}>
                                <div className={styles.panelContent}>
                                    <h3 className={styles.panelTitle}>{t('profileTitle')}</h3>
                                    {!isGithubLinked ? (
                                        <GithubAuthButton isGithubLinked={isGithubLinked} />
                                    ) : (
                                        <GithubAuthButton
                                            isGithubLinked={isGithubLinked}
                                            name={profileData.githubUsername}
                                        />
                                    )}
                                </div>
                            </div>
                            {isGithubLinked && (
                                <div className={styles.fadeIn}>
                                    <div className={styles.fullWidthSection}>
                                        <h3 className={styles.sectionTitle}>{t('workExperience')}</h3>
                                        <div className={styles.contentItem}>
                                            <p className={styles.contentTitle}>Senior Frontend Developer</p>
                                            <p className={styles.contentSubtitle}>Tech Company</p>
                                            <p className={styles.contentDate}>2020 - till now</p>
                                        </div>
                                    </div>
                                    <div className={styles.threeColumnGrid}>
                                        <div className={styles.gridCard}>
                                            <h3 className={styles.sectionTitle}>{t('tasksInProgress')}</h3>
                                            {!tasksInProgress.tasks ? (
                                                <AnimatedLoader
                                                    isLoading={!tasksInProgress.tasks}
                                                    onComplete={() => console.log(t('loadingComplete'))}
                                                />
                                            ) : (
                                                <div className={styles.contentItem}>
                                                    <ol className={styles.issuesList}>
                                                        {tasksInProgress.tasks.length > 0 ? (
                                                            tasksInProgress.tasks.map((task, index) => (
                                                                <Link
                                                                    key={task.assignmentId || index}
                                                                    to={`/issues/${task.issueId}`}
                                                                    className={styles.issueItem}
                                                                >
                                                                    <li className={index % 2 === 0 ? styles.even : styles.odd}>
                                                                        <span className={styles.issueTitle}>{task.issueTitle}</span>
                                                                        <span className={styles.issueId}>id:{task.assignmentId} </span>
                                                                    </li>
                                                                </Link>
                                                            ))
                                                        ) : (
                                                            <p>{t('noActiveAssignments')}</p>
                                                        )}
                                                    </ol>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.gridCard}>
                                            <h3 className={styles.sectionTitle}>{t('submittedTasks')}</h3>
                                            {!completedTasks ? (
                                                <AnimatedLoader
                                                    isLoading={!completedTasks}
                                                    onComplete={() => console.log(t('loadingComplete'))}
                                                />
                                            ) : (
                                                <div className={styles.contentItem}>
                                                    <ol className={styles.issuesList}>
                                                        {completedTasks.solutions?.length > 0 ? (
                                                            <>
                                                                <li className={styles.averageRow}>
                                                                    <span className={styles.issueTitle}>{t('avgRating')}</span>
                                                                    <StarRating rating={averageRating} />
                                                                </li>
                                                                {completedTasks.solutions
                                                                    .sort((a, b) => {
                                                                        if (a.status === 'checked' && b.status !== 'checked') return -1;
                                                                        if (a.status !== 'checked' && b.status === 'checked') return 1;
                                                                        return (a.assignmentId || 0) - (b.assignmentId || 0);
                                                                    })
                                                                    .map((solution, index) => (
                                                                        <li
                                                                            key={solution.assignmentId || solution.id || index}
                                                                            className={index % 2 === 0 ? styles.even : styles.odd}
                                                                            onClick={() => showModal(solution)}
                                                                        >
                                                                            <div className={styles.leftSection}>
                                        <span className={styles.issueTitle}>
                                          {t('task')} #{solution.assignmentId}
                                        </span>
                                                                                {solution.rating !== null && solution.rating !== undefined ? (
                                                                                    <StarRating rating={solution.rating} />
                                                                                ) : (
                                                                                    <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                            {t('noRating')}
                                          </span>
                                                                                )}
                                                                            </div>
                                                                            <span className={styles.issueId}>
                                        {solution.status === 'checked' ? t('checked') : t('pending')}
                                      </span>
                                                                        </li>
                                                                    ))}
                                                            </>
                                                        ) : (
                                                            <p>{t('noCompletedTasks')}</p>
                                                        )}
                                                    </ol>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.gridCard}>
                                            <h3 className={styles.sectionTitle}>{t('certificates')}</h3>
                                            <div className={styles.contentItem}>
                                                <p className={styles.contentTitle}>AWS Solutions Architect</p>
                                                <p className={styles.contentDate}>2023</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.twoColumnGrid}>
                                        <div className={styles.gridCard}>
                                            <h3 className={styles.sectionTitle}>{t('education')}</h3>
                                            <div className={styles.contentItem}>
                                                <p className={styles.contentTitle}>AITU</p>
                                                <p className={styles.contentSubtitle}>Software Engineering</p>
                                                <p className={styles.contentDate}>2015 - 2019</p>
                                            </div>
                                        </div>
                                        <div className={styles.gridCard}>
                                            <h3 className={styles.sectionTitle}>{t('languages')}</h3>
                                            <div className={styles.contentItem}>
                                                <p className={styles.contentTitle}>English</p>
                                                <p className={styles.contentSubtitle}>C1 Advanced</p>
                                            </div>
                                            <div className={styles.contentItem}>
                                                <p className={styles.contentTitle}>Russian</p>
                                                <p className={styles.contentSubtitle}>fluent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            <Modal
                title={`${t('task')} #${selectedSolution?.assignmentId}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => setIsModalOpen(false)}
            >
                {selectedSolution && (
                    <div className={styles.modal}>
                        <p>
                            <strong>{t('idLabel')}:</strong> {selectedSolution.solutionId}
                        </p>
                        <p>
                            <strong>{t('solutionLabel')}:</strong> {selectedSolution.solutionText}
                        </p>
                        <p>
                            <strong>{t('statusLabel')}:</strong> {selectedSolution.status}
                        </p>
                    </div>
                )}
            </Modal>
            <Footer />
        </>
    );
};

export default Profile;