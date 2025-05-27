// SolutionSection.jsx
import React from 'react';
import {Button, Tabs, Typography} from 'antd';
import IssueSolutions from "../components/IssueSolutions";
import styles from "../styles/CompanyIssue.module.css";
const { Text } = Typography;

const SolutionSection = ({
                             issueId,
                             userData,
                             solution,
                             isSubscribed,
                             issue,
                             handleSubscribe
                         }) => {
    if (!userData) {
        return (
            <div className={styles.userDataLoading}>
                <div className="loading-spinner"></div>
                <p>Loading user data...</p>
            </div>
        );
    }

    if (userData.role === "company") {
        return <IssueSolutions issueId={issueId}/>;
    }

    return (
        <>
            <div className={styles.taskContent}>
            {!isSubscribed && issue.assignmentStatus !== "completed" ? (
                <Button
                    type="primary"
                    onClick={handleSubscribe}
                    className={styles.subscribeButton}
                >
                    Subscribe to the task
                </Button>
            ) : issue.assignmentStatus === "completed" ? (
                <>
                    <h2>Your Solution</h2>
                    <div>
                        {solution ? (
                            <div className={styles.solutionCode}>
                                {solution.solutionText}
                            </div>
                        ) : (
                            <div className={styles.noSolution}>
                                The answer has not been sent yet
                            </div>
                        )}
                    </div>
                </>
            ) : null}
            </div>
        </>
    );
};

export default SolutionSection;