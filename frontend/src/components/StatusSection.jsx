// StatusSection.jsx
import React from 'react';
import { Typography, Divider } from 'antd';
import styles from "../styles/CompanyIssue.module.css";

const { Text } = Typography;

const StatusSection = ({ issue, submitError }) => {
    const getStatusBadgeClass = (status) => {
        if (!status) return styles.statusPending;

        switch(status.toLowerCase()) {
            case 'assigned': return styles.statusAssigned;
            case 'solved': return styles.statusSolved;
            case 'in progress': return styles.statusInProgress;
            case 'submitted': return styles.statusSubmitted;
            case 'completed': return styles.statusCompleted;
            default: return styles.statusPending;
        }
    };

    return (
        <div className={styles.issueHeader}>
            <h1 className={styles.issueTitle}>{issue.title}</h1>
            <div className={styles.issueInfo}>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(issue.assignmentStatus)}`}>
                    Status: {issue.assignmentStatus || "Waiting for processing"}
                </span>
                {submitError && (
                    <div className={styles.errorMessage}>
                        {submitError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusSection;