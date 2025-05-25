import React, { useState, useEffect, useContext } from 'react';
import styles from "../styles/Profile.module.css";
import '../App.css';
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import GithubAuthButton from "../components/GitHubLogin";
import AuthContext from "../contexts/AuthContext";
import {Link} from "react-router-dom";
import { Modal, Button } from 'antd';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [isGithubLinked, setIsGithubLinked] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [tasksInProgress, setTasksInProgress] = useState({ tasks: [] });
    const [completedTasks, setCompletedTasks] = useState({ tasks: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSolution, setSelectedSolution] = useState(null);

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
                const response = await fetch(`http://localhost:8081/v1/profile/${String(user.id)}`);
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
                    `http://localhost:8082/v1/developers/${user.id}/tasks/in-progress`,
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

                // Убедитесь, что data содержит поле tasks
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
                    `http://localhost:8082/v1/developers/${user.id}/solutions`,
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
                console.log("completed task data from server:", data); // <-- Вот здесь смотрим что пришло с сервера
                setCompletedTasks(data.solutions ? { solutions: data.solutions } : { solutions: [] });
            } catch (err) {
                console.error("Ошибка получения задач:", err);
                setCompletedTasks({ solutions: [] });
            }
        };

        fetchCompletedTasks();

    }, [user.id, user?.token]);


    if (error) return <div>Ошибка: {error}</div>;
    if (!profileData) return <div>Загрузка...</div>;


    const ratings = completedTasks?.solutions?.map(() => 4)|| [];
    const averageRating = ratings.length > 0
        ? 4: null;



    const StarRating = ({ rating, size = 12 }) => (
        <div style={{display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px'}}>

                    <span style={{fontSize: '0.7rem', color: '#fadb14', letterSpacing: '1px'}}>
              {Array.from({length: 5}, (_, i) => (
                  <span key={i}>{i < Math.floor(rating) ? '★' : '☆'}</span>
              ))}
            </span>
            <span style={{fontSize: '1rem', fontWeight: 'bold'}}>
              {rating}
            </span>
        </div>
    );
    return (
        <>
            <Navbar/>
            <div className={styles.profileContainer}>
                {/* Левая часть профиля */}
                <div className={styles.profileLeft}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatarContainer}>
                            <img
                                src={profileData.avatarUrl || "/default-avatar.png"}
                                alt="Profile"
                                className={styles.avatarImage}
                            />
                        </div>
                        <h1 className={styles.profileName}>{profileData.username}</h1>
                        <a href={`mailto:${profileData.email}`} className={styles.profileEmail}>
                            {profileData.email}
                        </a>
                        <p className={styles.profileDescription}>{profileData.bio || "No Description"}</p>

                        {profileData.cvUrl && (
                            <a href={profileData.cvUrl} target="_blank" rel="noopener noreferrer" className={styles.cvLink}>
                                📄 Открыть резюме
                            </a>
                        )}
                    </div>
                </div>

                {/* Правая часть профиля */}
                <div className={styles.profileRight}>
                    <div className={styles.topPanel}>
                        <div className={styles.panelContent}>
                            <h3 className={styles.panelTitle}>Profile</h3>
                            {!isGithubLinked ? (
                                <GithubAuthButton />
                            ) : (
                                <div className={styles.githubLinked}>
                                    <svg className={styles.checkIcon} fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <a
                                        href={`https://github.com/${profileData.githubUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.githubLink}
                                    >
                                        @{profileData.githubUsername}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content that appears after GitHub is linked */}
                    {isGithubLinked && (
                        <div className={styles.fadeIn}>
                            {/* Experience - Full Width */}
                            <div className={styles.fullWidthSection}>
                                <h3 className={styles.sectionTitle}>Work Experience</h3>
                                <div className={styles.contentItem}>
                                    <p className={styles.contentTitle}>Senior Frontend Developer</p>
                                    <p className={styles.contentSubtitle}>Tech Company</p>
                                    <p className={styles.contentDate}>2020 - till now</p>
                                </div>
                            </div>

                            {/* Three Equal Columns */}
                            <div className={styles.threeColumnGrid}>
                                <div className={styles.gridCard}>
                                    <h3 className={styles.sectionTitle}>Tasks</h3>
                                    <div className={styles.contentItem}>
                                        <ol className={styles.issuesList}>
                                            {tasksInProgress.tasks?.length > 0 ? (
                                                tasksInProgress.tasks.map((task, index) => (
                                                    <Link to={`/issues/${task.issueId}`} сlassName={styles.issueItem}>

                                                        <li key={task.assignmentId || index}
                                                            className={index % 2 === 0 ? styles.even : styles.odd}>
                                                            <span className={styles.issueTitle}>{task.issueTitle}</span>
                                                            <span
                                                                className={styles.issueId}>id:{task.assignmentId} </span>
                                                        </li>
                                                    </Link>

                                                ))
                                            ) : (
                                                <p>No active assignments</p>
                                            )}
                                        </ol>
                                    </div>
                                </div>

                                <div className={styles.gridCard}>
                                    <h3 className={styles.sectionTitle}>Submitted Tasks</h3>
                                    <div className={styles.contentItem}>
                                        <ol className={styles.issuesList}>
                                            {completedTasks?.solutions?.length > 0 ? (
                                                <>
                                                    {/* Первая строка - средняя оценка */}
                                                    <li className={styles.averageRow}>
                                                        <span className={styles.issueTitle}>Avg Rating</span>
                                                        <StarRating rating={averageRating}/>
                                                    </li>

                                                    {/* Остальные элементы списка */}
                                                    {completedTasks.solutions.map((solution, index) => (
                                                        <li key={solution.id}
                                                            className={index % 2 === 0 ? styles.even : styles.odd}
                                                            onClick={() => showModal(solution)} // передаём конкретную задачу
                                                        >
                                                            <div className={styles.leftSection}>
                                                                <span
                                                                    className={styles.issueTitle}>task #{solution.assignmentId}</span>
                                                                <StarRating rating={ratings[index]}/>
                                                            </div>
                                                            <span className={styles.issueId}>
                                {solution.status === 'checked' ? 'Checked' : 'Pending'}</span>
                                                        </li>
                                                    ))}
                                                </>
                                            ) : (
                                                <p>Нет завершенных задач</p>
                                            )}
                                        </ol>
                                    </div>
                                </div>

                                <div className={styles.gridCard}>
                                    <h3 className={styles.sectionTitle}>Certificates</h3>
                                    <div className={styles.contentItem}>
                                        <p className={styles.contentTitle}>AWS Solutions Architect</p>
                                        <p className={styles.contentDate}>2023</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.twoColumnGrid}>
                                <div className={styles.gridCard}>
                                    <h3 className={styles.sectionTitle}>Education</h3>
                                    <div className={styles.contentItem}>
                                        <p className={styles.contentTitle}>AITU</p>
                                        <p className={styles.contentSubtitle}>Software Engineering</p>
                                        <p className={styles.contentDate}>2015 - 2019</p>
                                    </div>
                                </div>

                                <div className={styles.gridCard}>
                                    <h3 className={styles.sectionTitle}>Languages</h3>
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
            <Modal
                title={`Task #${selectedSolution?.assignmentId}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => setIsModalOpen(false)}
            >
                {selectedSolution && (
                    <div className={styles.modal}>
                        <p><strong>ID:</strong> {selectedSolution.solutionId}</p>
                        <p><strong>Solution:</strong> {selectedSolution.solutionText}</p>
                        <p><strong>Status:</strong> {selectedSolution.status}</p>
                    </div>
                )}
            </Modal>
            <Footer />
        </>
    );
};

export default Profile;