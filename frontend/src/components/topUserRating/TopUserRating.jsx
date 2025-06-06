import React, {useState, useEffect, useContext} from 'react';
import { Card, List, Avatar, Button, Spin, Alert, Typography, Space, Badge } from 'antd';
import { TrophyOutlined, StarOutlined, StarFilled, CrownOutlined, GithubOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './TopUserRating.module.css';
import {I18nContext} from "../../contexts/i18nContext";

const { Title, Text, Paragraph } = Typography;


const CustomRate = ({ value, size = 14 }) => {
    const stars = [];
    const rating = parseFloat(value) || 0;

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(
                <StarFilled
                    key={i}
                    style={{
                        color: '#fadb14',
                        fontSize: size,
                        marginRight: '2px'
                    }}
                />
            );
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars.push(
                <span
                    key={i}
                    style={{
                        position: 'relative',
                        display: 'inline-block',
                        marginRight: '2px',
                        verticalAlign: 'baseline'
                    }}
                >
                    <StarOutlined
                        style={{
                            color: '#f0f0f0',
                            fontSize: size
                        }}
                    />
                    <StarFilled
                        style={{
                            color: '#fadb14',
                            fontSize: size,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            clipPath: 'inset(0 50% 0 0)',
                            overflow: 'hidden'
                        }}
                    />
                </span>
            );
        } else {
            stars.push(
                <StarOutlined
                    key={i}
                    style={{
                        color: '#f0f0f0',
                        fontSize: size,
                        marginRight: '2px'
                    }}
                />
            );
        }
    }

    return <span>{stars}</span>;
};

const TopUsersRating = ({ user }) => {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const { t } = useContext(I18nContext);

    const fetchProfile = async (developerId) => {
        try {
            const response = await fetch(`http://localhost:8081/v1/profile/${String(developerId)}`);
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(`Ошибка получения профиля для ${developerId}:`, err);
            return null;
        }
    };

    const fetchTopUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:8091/api/top-rating/developers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }

            const data = await response.json();
            const usersWithProfiles = await Promise.all(
                data.map(async (ratingData) => {
                    const profile = await fetchProfile(ratingData.developerId);
                    return {
                        ...ratingData,
                        profile: profile
                    };
                })
            );
            setLoading(false);
            setTopUsers(usersWithProfiles);
        } catch (err) {
            console.error("Ошибка получения топа пользователей:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchTopUsers();
    }, [user]);

    const getRankIcon = (index) => {
        switch (index) {
            case 0:
                return <TrophyOutlined className={`${styles.rankIcon} ${styles.rankIconFirst}`} />;
            case 1:
                return <StarOutlined className={`${styles.rankIcon} ${styles.rankIconSecond}`} />;
            case 2:
                return <CrownOutlined className={`${styles.rankIcon} ${styles.rankIconThird}`} />;
            default:
                return (
                    <Badge
                        count={index + 1}
                        style={{ backgroundColor: '#1890ff', fontSize: '14px', fontWeight: 'bold' }}
                    />
                );
        }
    };

    const getCardStyle = (index) => {
        switch (index) {
            case 0:
                return `${styles.userCard} ${styles.userCardFirst}`;
            case 1:
                return `${styles.userCard} ${styles.userCardSecond}`;
            case 2:
                return `${styles.userCard} ${styles.userCardThird}`;
            default:
                return `${styles.userCard} ${styles.userCardOther}`;
        }
    };


    if (error) {
        return (
            <Card
                title={
                    <div className={styles.header}>
                        <TrophyOutlined style={{ color: '#faad14' }} />
                        <Title level={3} style={{ margin: 0, color: 'var(--text-color)' }}>{t('top_developers')}</Title>
                    </div>
                }
                className={styles.card}
            >
                <Alert
                    message="Ошибка загрузки данных"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" danger onClick={fetchTopUsers}>
                            Try Again
                        </Button>
                    }
                />
            </Card>
        );
    }

    return (
        <Card
            title={
                <div className={styles.header}>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Title level={3} style={{ margin: 0, color: 'var(--text-color)' }}>{t('top_developers')}</Title>
                </div>
            }
            extra={
                <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={fetchTopUsers}
                    loading={loading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        margin: 0,
                        color: isHovered ? 'var(--accent-color)' : 'var(--text-color)',
                        backgroundColor: isHovered ? 'var(--secondary-color)' : 'transparent',
                        transition: 'all 0.2s ease',
                        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                        boxShadow: isHovered ? '0 2px 8px rgba(59, 130, 246, 0.2)' : 'none'
                    }}
                >
                    {t('update')}
                </Button>
            }
            className={styles.card}
        >
            <Spin spinning={loading}>
                {topUsers.length === 0 && !loading ? (
                    <div className={styles.loadingContainer}>
                        <Text type="secondary">{t('no_data_to_display')}</Text>
                    </div>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={topUsers}
                        renderItem={(developer, index) => (
                            <List.Item className={styles.listItem}>
                                <Card
                                    size="small"
                                    className={getCardStyle(index)}
                                    hoverable
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div className={styles.avatarContainer}>
                                                <div className={`${styles.rankNumber} ${index < 3 ? styles.rankNumberTop : styles.rankNumberOther}`}>
                                                    {index + 1}
                                                </div>
                                                {getRankIcon(index)}
                                                <Avatar
                                                    size={48}
                                                    src={developer.profile?.avatarUrl}
                                                    className={styles.userAvatar}
                                                >
                                                    {!developer.profile?.avatarUrl && (
                                                        developer.profile?.username ?
                                                            developer.profile.username.charAt(0).toUpperCase() :
                                                            developer.profile?.email ?
                                                                developer.profile.email.charAt(0).toUpperCase() : '?'
                                                    )}
                                                </Avatar>
                                            </div>
                                        }
                                        title={
                                            <div className={styles.userInfo}>
                                                <Space>
                                                    <Text className={styles.userName}>
                                                        {developer.profile?.username ||
                                                            developer.profile?.email ||
                                                            `${t('user')} #${developer.developerId}`}
                                                    </Text>
                                                    {developer.profile?.githubUsername && (
                                                        <Space size={4}>
                                                            <GithubOutlined className={styles.githubLink} />
                                                            <Text type="secondary" className={styles.githubLink}>
                                                                @{developer.profile.githubUsername}
                                                            </Text>
                                                        </Space>
                                                    )}
                                                </Space>
                                                {developer.profile?.bio && (
                                                    <Paragraph className={styles.userBio} ellipsis={{ rows: 1 }}>
                                                        {developer.profile.bio}
                                                    </Paragraph>
                                                )}
                                            </div>
                                        }
                                        description={
                                            <div className={styles.ratingContainer}>
                                                <CustomRate value={developer.averageRating || 0} />
                                                <Text className={styles.ratingValue}>
                                                    {(developer.averageRating || 0).toFixed(1)}
                                                </Text>
                                            </div>
                                        }
                                    />
                                    <div className={styles.ratingDisplay}>
                                        <Text className={`${styles.ratingDisplayValue} ${index < 3 ? styles.ratingDisplayValueTop : styles.ratingDisplayValueOther}`}>
                                            {(developer.averageRating || 0).toFixed(1)}
                                        </Text>
                                        <br />
                                        <Text className={styles.ratingDisplayLabel}>
                                            {t('rating')}
                                        </Text>
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Spin>
        </Card>
    );
};

export default TopUsersRating;