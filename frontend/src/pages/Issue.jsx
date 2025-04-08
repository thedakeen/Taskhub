import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import styles from "../styles/CompanyIssue.module.css";
import AuthContext from "../contexts/AuthContext";

const CompanyIssue = () => {
    const { issueId } = useParams();
    const [issue, setIssue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solutionText, setSolutionText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                setLoading(true);
                console.log()
                const response = await fetch(
                    `http://localhost:8082/v1/issues/${issueId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                const data = await response.json();
                setIssue(data);
                setIsSubscribed(data.assignmentStatus === "assigned");
                if (data.solutionText) {
                    setSolutionText(data.solutionText);
                }
            } catch (err) {
                console.error("Ошибка получения issue:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchIssue();
        }
    }, [issueId, user]);

    const handleSubscribe = async () => {
        try {
            const response = await fetch(
                `http://localhost:8082/v1/issues/${issueId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка: ${errorText}`);
            }

            const result = await response.json;
            setIsSubscribed(true);
            setIssue(prev => ({
                ...prev,
                assignmentStatus: "assigned"
            }));
            console.log("Подписка успешна:", result);

        } catch (err) {
            console.error("Ошибка подписки:", err);
            setSubmitError(err.message);
        }
    };
    const handleSubmitSolution = async (e) => {
        e.preventDefault();
        if (!solutionText.trim()) {
            setSubmitError("Пожалуйста, введите текст решения");
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError(null);

            const url = `http://localhost:8082/v1/issues/${issueId}/submit?solutionText=${encodeURIComponent(solutionText)}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                },
            });


            // Обработка ответа
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            const result = await response;
            console.log("Успешный ответ:", result);

            // Обновление состояния
            setIssue(prev => ({
                ...prev,
                solutionText,
                solutionStatus: "submitted"
            }));

            setSubmitSuccess(true);

        } catch (err) {
            console.error("Ошибка:", err);
            setSubmitError(err.message || "Ошибка при отправке решения");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        if (!status) return styles.statusPending;

        switch(status.toLowerCase()) {
            case 'assigned': return styles.statusAssigned;
            case 'solved': return styles.statusSolved;
            case 'in progress': return styles.statusInProgress;
            case 'submitted': return styles.statusSubmitted;
            default: return styles.statusPending;
        }
    };

    if (error) {
        return (
            <>
                <Navbar />
                <div className={styles.errorContainer}>
                    <div className={styles.errorCard}>
                        <h2>Произошла ошибка</h2>
                        <p>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Загрузка данных...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.pageContainer}>
                <div className={styles.issueCard}>
                    <div className={styles.issueHeader}>
                        <h1 className={styles.issueTitle}>{issue.title}</h1>
                        <div className={styles.issueInfo}>
                            <span className={styles.issueId}>ID: {issue.issueId}</span>
                            <span className={`${styles.statusBadge} ${getStatusBadgeClass(issue.assignmentStatus)}`}>
                                {issue.assignmentStatus || "Ожидает обработки"}
                            </span>
                        </div>
                    </div>
                    <div className={styles.issueContent}>
                        <div className={styles.issueDescription}>
                            <h3>Описание</h3>
                            <p>{issue.body}</p>
                        </div>

                        <div className={styles.solutionSection}>
                            <h3>Решение</h3>

                            {issue.solutionText ? (
                                <div className={styles.existingSolution}>
                                    <p>{issue.solutionText}</p>
                                    <div className={styles.solutionStatus}>
                                        <span
                                            className={`${styles.statusBadge} ${getStatusBadgeClass(issue.solutionStatus)}`}>
                                            {issue.solutionStatus || "В ожидании"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitSolution} className={styles.solutionForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="solutionText">Введите ваше решение:</label>
                                        <textarea
                                            id="solutionText"
                                            className={styles.solutionTextarea}
                                            value={solutionText}
                                            onChange={(e) => setSolutionText(e.target.value)}
                                            placeholder="Опишите решение задачи..."
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    {submitError && (
                                        <div className={styles.errorMessage}>
                                            {submitError}
                                        </div>
                                    )}

                                    {submitSuccess && (
                                        <div className={styles.successMessage}>
                                            Решение успешно отправлено!
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Отправка...' : 'Отправить решение'}
                                    </button>
                                    <div className={styles.issueActions}>
                                        {!isSubscribed && issue?.assignmentStatus !== "in_progress" && (
                                            <button
                                                onClick={handleSubscribe}
                                                className={styles.subscribeButton}
                                            >
                                                Подписаться на задание
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CompanyIssue;