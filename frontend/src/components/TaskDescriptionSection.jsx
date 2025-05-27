// TaskDescriptionSection.jsx
import React from 'react';
import { Tabs, Divider } from 'antd';
import styles from "../styles/CompanyIssue.module.css";

const TaskDescriptionSection = ({ issue }) => {
    return (
        <div className={styles.taskContent}>
            <Tabs
                defaultActiveKey="description"
                className={styles.taskTabs}
                items={[
                    {
                        key: 'description',
                        label: (<span style={{color: 'var(--text-color)'}}>Description</span>),
                        children: (
                            <div className={styles.taskDescription}>
                                <p>{issue.body}</p>
                            </div>
                        )
                    },
                    {
                        key: 'requirements',
                        label: (<span style={{color: 'var(--text-color)'}}>Requirements</span>),
                        children: (
                            <div className={styles.taskRequirements}>
                                <ul>
                                    <li>Реализуйте решение, которое соответствует описанию задачи</li>
                                    <li>Обработайте все возможные краевые случаи</li>
                                    <li>Оптимизируйте решение по времени и памяти</li>
                                    <li>Используйте понятные имена переменных и функций</li>
                                    <li>Добавьте комментарии, поясняющие ключевые моменты решения</li>
                                </ul>
                            </div>
                        )
                    },
                    {
                        key: 'examples',
                        label: (<span style={{color: 'var(--text-color)'}}>Examples</span>),
                        children: (
                            <div className={styles.taskExamples}>
                                <div className={styles.exampleBlock}>
                                    <div><strong>Ввод:</strong> 5</div>
                                    <div><strong>Ожидаемый вывод:</strong> Решение для входных данных 5</div>
                                </div>
                                <div className={styles.exampleBlock}>
                                    <div><strong>Ввод:</strong> 10</div>
                                    <div><strong>Ожидаемый вывод:</strong> Решение для входных данных 10</div>
                                </div>
                            </div>
                        )
                    }
                ]}
            />
            <Divider/>
        </div>
    );
};

export default TaskDescriptionSection;