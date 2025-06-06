import React, { useContext } from 'react';
import IssueSolutions from "../components/IssueSolutions";
import styles from "../styles/CompanyIssue.module.css";
import { Button, Typography } from 'antd';
import { I18nContext } from "../contexts/i18nContext";

const { Text } = Typography;

const SolutionSection = ({
                             issueId,
                             userData,
                             solution,
                             isSubscribed,
                             issue,
                             handleSubscribe
                         }) => {
    const { t } = useContext(I18nContext);

    if (!userData) {
        return (
            <div className={styles.userDataLoading}>
                <div className="loading-spinner"></div>
                <p>{t('loading_user_data')}</p>
            </div>
        );
    }

    if (userData.role === "company") {
        return <IssueSolutions issueId={issueId} />;
    }

    return (
        <div className={styles.taskContent}>
            {!isSubscribed && issue.assignmentStatus !== "completed" ? (
                <Button
                    type="primary"
                    onClick={handleSubscribe}
                    className={styles.subscribeButton}
                >
                    {t('subscribe_to_the_task')}
                </Button>
            ) : issue.assignmentStatus === "completed" ? (
                <>
                    <h2>{t('your_solution')}</h2>
                    <div>
                        {solution ? (
                            <div className={styles.solutionCode}>
                                {solution.solutionText}
                            </div>
                        ) : (
                            <div className={styles.noSolution}>
                                {t('answer_not_sent')}
                            </div>
                        )}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default SolutionSection;
