import React, {useContext} from 'react';
import { Tabs, Divider } from 'antd';
import styles from "../styles/CompanyIssue.module.css";
import {I18nContext} from "../contexts/i18nContext";

const TaskDescriptionSection = ({ issue }) => {
    const { t } = useContext(I18nContext);

    return (
        <div className={styles.taskContent}>
            <Tabs
                defaultActiveKey="description"
                className={styles.taskTabs}
                items={[
                    {
                        key: 'description',
                        label: (<span style={{ color: 'var(--text-color)' }}>{t('description')}</span>),
                        children: (
                            <div className={styles.taskDescription}>
                                <p>{issue.body}</p>
                            </div>
                        )
                    },
                    {
                        key: 'requirements',
                        label: (<span style={{ color: 'var(--text-color)' }}>{t('requirements')}</span>),
                        children: (
                            <div className={styles.taskRequirements}>
                                <ul>
                                    <li>{t('req_match_task_description')}</li>
                                    <li>{t('req_handle_edge_cases')}</li>
                                    <li>{t('req_optimize_time_memory')}</li>
                                    <li>{t('req_clear_names')}</li>
                                    <li>{t('req_add_comments')}</li>
                                </ul>
                            </div>
                        )
                    },
                    {
                        key: 'examples',
                        label: (<span style={{ color: 'var(--text-color)' }}>{t('examples')}</span>),
                        children: (
                            <div className={styles.taskExamples}>
                                <div className={styles.exampleBlock}>
                                    <div><strong>{t('input')}:</strong> 5</div>
                                    <div><strong>{t('expected_output')}:</strong> {t('solution_for_input', { value: 5 })}</div>
                                </div>
                                <div className={styles.exampleBlock}>
                                    <div><strong>{t('input')}:</strong> 10</div>
                                    <div><strong>{t('expected_output')}:</strong> {t('solution_for_input', { value: 10 })}</div>
                                </div>
                            </div>
                        )
                    }
                ]}
            />
            <Divider />
        </div>
    );
};

export default TaskDescriptionSection;