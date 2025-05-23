import React, { useContext, useEffect, useState } from "react";
import {
    Layout,
    Typography,
    Select,
    Button,
    Divider,
    Tabs,
    Tooltip,
    Space,
    message,
    Badge,
    Card,
    List,
    Modal,
    Rate,
    Input,
    Avatar
} from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseOutlined,
    FullscreenOutlined,
    StarOutlined,
    UserOutlined
} from "@ant-design/icons";
import moment from "moment/moment";
import AuthContext from "../contexts/AuthContext";

const { Text, Title } = Typography;
const { TextArea } = Input;

const IssueSolutions = ({ issueId }) => {
    const [solutions, setSolutions] = useState([]);
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8082/v1/issues/${issueId}/solutions`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();
                const solutionsArray = data.solutions || (Array.isArray(data) ? data : []);
                setSolutions(solutionsArray);
            } catch (err) {
                console.error("Ошибка получения решений задания:", err);
                setError(err.message);
                setSolutions([]);
            }
        };

        if (user?.token) {
            fetchSolutions();
        }
    }, [issueId, user]);



    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <Badge status="success" text="Завершено" />;
            case 'in_progress':
                return <Badge status="processing" text="В процессе" />;
            case 'pending':
                return <Badge status="warning" text="Ожидание" />;
            case 'failed':
                return <Badge status="error" text="Ошибка" />;
            default:
                return <Badge status="default" text={status} />;
        }
    };

    const formatCodeText = (text) => {
        if (!text) return 'Нет текста решения';

        if (text.includes('function') || text.includes('console.log') ||
            text.includes('return') || text.includes('//')) {
            return (
                <pre style={{
                    background: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '4px',
                    maxHeight: '150px',
                    overflow: 'auto',
                    fontSize: '12px'
                }}>
                    {text}
                </pre>
            );
        }

        return <Text ellipsis={{ tooltip: text }}>{text}</Text>;
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD.MM.YYYY HH:mm');
    };

    const handleSolutionClick = (solution) => {
        setSelectedSolution(solution);
        setRating(solution.rating || 0);
        setFeedback(solution.feedback || '');
        setIsModalVisible(true);
    };

    const handleRatingSubmit = async () => {
        try {
            const response = await fetch(
                    `http://localhost:8091/api/rating/${selectedSolution.solutionId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({
                        rating: rating,
                    })
                }
            );

            if (!response.ok) {
                const contentType = response.headers.get('Content-Type');
                let errorMessage = `Ошибка при оценке: ${response.status}`;

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } else {
                    const text = await response.text();
                    errorMessage = text || errorMessage;
                }

                console.log(errorMessage)
                throw new Error(errorMessage);
            }


            const updatedSolutions = solutions.map(sol =>
                sol.solutionId === selectedSolution.solutionId
                    ? { ...sol, rating, feedback }
                    : sol
            );

            setSolutions(updatedSolutions);
            message.success('Оценка сохранена!');
            setIsModalVisible(false);
        } catch (err) {
            console.error("Ошибка при отправке оценки:", err);
            message.error(err.message || 'Не удалось сохранить оценку');
        }
    };

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <Title level={3} style={{ color: 'white', marginBottom: '24px' }}>Список решений</Title>

            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 3,
                    xl: 3,
                    xxl: 4,
                }}
                dataSource={solutions}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            title={`Решение #${item.solutionId?.substring(0, 8) || 'N/A'}`}
                            hoverable
                            style={{
                                background: 'white',
                                borderColor: '#333',
                                color: 'white'
                            }}
                            extra={getStatusBadge(item.status)}
                            actions={[
                                <Tooltip title="Просмотреть полностью">
                                    <FullscreenOutlined
                                        onClick={() => handleSolutionClick(item)}
                                        style={{ color: '#1890ff' }}
                                    />
                                </Tooltip>,
                                <Tooltip title="Оценить">
                                    <StarOutlined
                                        onClick={() => handleSolutionClick(item)}
                                        style={{ color: item.rating ? '#faad14' : '#666' }}
                                    />
                                </Tooltip>
                            ]}
                        >
                            <div style={{ cursor: 'pointer' }} onClick={() => handleSolutionClick(item)}>
                                <div style={{ marginBottom: '12px',color:"black" }}>
                                    {formatCodeText(item.solutionText)}
                                </div>
                                <div>
                                    <Space direction="vertical" size="small">
                                        <Text type="secondary" style={{ color: '#8c8c8c' }}>
                                            <ClockCircleOutlined /> Назначено: {formatDate(item.assignedAt)}
                                        </Text>
                                        {item.completedAt && (
                                            <Text type="secondary" style={{ color: '#8c8c8c' }}>
                                                <CheckCircleOutlined /> Выполнено: {formatDate(item.completedAt)}
                                            </Text>
                                        )}
                                        {item.rating && (
                                            <Rate
                                                disabled
                                                defaultValue={item.rating}
                                                style={{ fontSize: '14px' }}
                                            />
                                        )}
                                    </Space>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
                locale={{ emptyText: 'Нет доступных решений' }}
            />

            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            icon={<UserOutlined />}
                            src={selectedSolution?.user?.avatar}
                            style={{ marginRight: '10px' }}
                        />
                        <span>
                Решение #{selectedSolution?.solutionId?.substring(0, 8) || 'N/A'}
                            {/*{selectedSolution?.user?.name || 'Анонимный пользователь'}*/}
            </span>
                    </div>
                }
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width="80%"
                style={{ top: 20,
                    padding: '24px',
                    background: '#1f1f1f',
                    color: 'white',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
                closeIcon={<CloseOutlined style={{ color: 'white' }} />}
            >
                {selectedSolution && (
                    <div>
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={4} style={{ color: 'white' }}>Код решения:</Title>
                            <pre style={{
                                background: '#2a2a2a',
                                padding: '16px',
                                borderRadius: '4px',
                                color: '#f8f8f2',
                                overflowX: 'auto',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}>
                    {selectedSolution.solutionText}
                </pre>
                        </div>

                            <div style={{ marginBottom: '24px' }}>
                                <Title level={4} style={{ color: 'white' }}>Детали:</Title>
                                <div style={{
                                    background: 'white',
                                    padding: '16px',
                                    borderRadius: '4px'
                                }}>
                                    <Space direction="vertical" size="middle">
                                        <div>
                                            <Text strong style={{ color: '#8c8c8c' }}>Статус:</Text>{' '}
                                            {getStatusBadge(selectedSolution.status)}
                                        </div>
                                        <div>
                                            <Text strong style={{ color: '#8c8c8c' }}>Назначено:                                             {formatDate(selectedSolution.assignedAt)}
                                            </Text>
                                        </div>
                                        {selectedSolution.completedAt && (
                                            <div>
                                                <Text strong style={{ color: '#8c8c8c' }}>Завершено: {formatDate(selectedSolution.completedAt)}</Text>
                                            </div>
                                        )}
                                        {selectedSolution.assignmentId && (
                                            <div>
                                                <Text strong style={{ color: '#8c8c8c' }}>ID задания:                                                 {selectedSolution.assignmentId}
                                                </Text>
                                            </div>
                                        )}
                                    </Space>
                                </div>
                            </div>

                            <div>
                                <Title level={4} style={{ color: 'black',background:'white' }}>Оценка решения:</Title>
                                <div style={{
                                    background: '#white',
                                    padding: '16px',
                                    borderRadius: '4px'
                                }}>
                                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                        <div>
                                            <Text strong style={{ color: '#8c8c8c' }}>Оценка:</Text>
                                            <Rate
                                                value={rating}
                                                onChange={setRating}
                                                style={{ marginLeft: '10px' }}
                                            />
                                        </div>
                                        <div>
                                            <Text strong style={{ color: '#8c8c8c' }}>Комментарий:</Text>
                                            <TextArea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                rows={4}
                                                style={{
                                                    marginTop: '10px',
                                                    background: 'white',
                                                    color: 'black',
                                                    borderColor: '#333'
                                                }}
                                                placeholder="Оставьте ваш отзыв о решении..."
                                            />
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={handleRatingSubmit}
                                            icon={<StarOutlined />}
                                        >
                                            Сохранить оценку
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    )}
                    </Modal>
                    </div>
                    );
                }

export default IssueSolutions;