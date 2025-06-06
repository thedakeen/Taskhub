import React, { useContext } from 'react';
import { Typography, Divider } from 'antd';
import styles from "../styles/CompanyIssue.module.css";
import { I18nContext } from "../contexts/i18nContext";

const { Text } = Typography;

const StatusSection = ({ issue, submitError }) => {
    const { t } = useContext(I18nContext);

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

    const getLocalizedStatus = (status) => {
        if (!status) return t('status_waiting');
        return t(`status_${status.toLowerCase().replace(/\s+/g, '_')}`, status);
    };

    return (
        <div className={styles.issueHeader}>
            <h1 className={styles.issueTitle}>{issue.title}</h1>
            <div className={styles.issueInfo}>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(issue.assignmentStatus)}`}>
                    {t('status')}: {getLocalizedStatus(issue.assignmentStatus)}
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
