import {useState, useEffect, useContext} from "react";
import { User, Search, Lock, LogOut } from "lucide-react";
import styles from "../styles/AdminPAnetl.module.css";
import AuthContext from "../contexts/AuthContext";

// Компонент шапки с навигационными кнопками
const Header = ({ activeTab, onTabChange }) => {
    return (
        <header className={styles.header}>
            <div className={styles.navButtons}>
                <button
                    className={`${styles.navButton} ${activeTab === 'users' ? styles.navButtonActive : ''}`}
                    onClick={() => onTabChange('users')}
                >
                    <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Пользователи
                    </div>
                </button>
                <button
                    className={`${styles.navButton} ${activeTab === 'permissions' ? styles.navButtonActive : ''}`}
                    onClick={() => onTabChange('permissions')}
                >
                    <div className="flex items-center">
                        <Lock size={16} className="mr-2" />
                        Права доступа
                    </div>
                </button>
            </div>

            <div className={styles.userMenu}>
                <span>Администратор</span>
                <button className={styles.logoutButton}>
                    <LogOut size={16} className={styles.logoutIcon} />
                    Выйти
                </button>
            </div>
        </header>
    );
};

// Компонент уведомления
const Notification = ({ show, message, type }) => {
    if (!show) return null;

    return (
        <div className={`
      ${styles.notification} 
      ${type === "success" ? styles.notificationSuccess :
            type === "error" ? styles.notificationError :
                styles.notificationInfo}
    `}>
            {message}
        </div>
    );
};

// Компонент поиска
const SearchBar = ({ value, onChange }) => {
    return (
        <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Поиск пользователей..."
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

// Компонент таблицы пользователей
// Компонент таблицы пользователей
const UsersTable = ({ users, onUserUpdate }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                <tr>
                    <th className={styles.tableHeaderCell}>ID</th>
                    <th className={styles.tableHeaderCell}>Имя пользователя</th>
                    <th className={styles.tableHeaderCell}>Email</th>
                    <th className={styles.tableHeaderCell}>Роль</th>
                    <th className={styles.tableHeaderCell}>Дата регистрации</th>
                    <th className={styles.tableHeaderCell}>Статус</th>
                    <th className={styles.tableHeaderCell}>Действия</th>
                </tr>
                </thead>
                <tbody className={styles.tableBody}>
                {users.map(user => (
                    <UserTableRow key={user.id} user={user} onUserUpdate={onUserUpdate} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

// Компонент пагинации
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
                Показано {indexOfFirstItem} - {indexOfLastItem} из {totalItems} пользователей
            </div>

            <div className={styles.paginationControls}>
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className={`${styles.paginationButton} ${styles.paginationButtonLeft} ${
                        currentPage === 1 ? styles.paginationButtonDisabled : styles.paginationButtonInactive
                    }`}
                >
                    Назад
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`${styles.paginationButton} ${
                            currentPage === page ? styles.paginationButtonActive : styles.paginationButtonInactive
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`${styles.paginationButton} ${styles.paginationButtonRight} ${
                        currentPage === totalPages ? styles.paginationButtonDisabled : styles.paginationButtonInactive
                    }`}
                >
                    Вперед
                </button>
            </div>
        </div>
    );
};

const UserTableRow = ({ user, onUserUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = async (userId, data) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/admin/update-user-role/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении роли');
            }

            // Обновляем данные в родительском компоненте
            onUserUpdate(userId, data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    return (
        <>
            <tr className={styles.tableRow}>
                <td className={styles.tableCell}>{user.id}</td>
                <td className={`${styles.tableCell} text-blue-500 font-medium`}>{user.username}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.role}</td>
                <td className={styles.tableCell}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${
                        user.activated ? styles.statusAdmin : styles.statusUser
                    }`}>
                        {user.activated ? 'Активирован' : 'Не активирован'}
                    </span>
                </td>
                <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Set Company
                        </button>
                        <button className={`${styles.actionButton} ${styles.deleteButton}`}>
                            Удалить
                        </button>
                    </div>
                </td>
            </tr>

            {isModalOpen && (
                <UserEditModal
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

const UserEditModal = ({ user, onClose }) => {
    const [role, setRole] = useState(user.role);
    const [companyId, setCompanyId] = useState(user.companyId || 0);
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useContext(AuthContext); // или пробрось token через props

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8090/admin/update-user-role/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyId, role:"company" })
            });

            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка: ${response.status}`);
            }

            const result = await response.json();
            console.log('Роль пользователя обновлена:', result);
            onClose();
        } catch (err) {
            console.error('Ошибка при обновлении роли пользователя:', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                    <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>ID компании:</label>
                        <input
                            type="number"
                            value={companyId}
                            onChange={(e) => setCompanyId(Number(e.target.value))}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Роль: company</label>
                    </div>
                    <div className={styles.modalButtons}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.saveButton}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// Главный компонент админ-панели
const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [activeTab, setActiveTab] = useState('users');

    const usersPerPage = 5;
    const handleUserUpdate = (userId, newData) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, role: newData.role } : user
            )
        );
        setFilteredUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, role: newData.role } : user
            )
        );
        showNotification('Роль пользователя успешно обновлена', 'success');
    };

    // Загрузка данных с сервера
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); // Или из контекста аутентификации
                const response = await fetch('http://localhost:8090/admin', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    }
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    console.error('Error response data:', errorData);
                    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Received data:', data);

                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error('Fetch error:', error);
                showNotification(`Ошибка доступа: ${error.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Фильтрация по поисковому запросу
    useEffect(() => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.role.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchText, users]);

    // Показать уведомление
    const showNotification = (message, type = "info") => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
    };

    // Пагинация
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className={styles.adminLayout}>
            {/* Основной контент без боковой панели */}
            <div className={styles.mainContent}>
                {/* Шапка с навигационными вкладками */}
                <Header activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Контент */}
                <main className={styles.content}>
                    {/* Уведомление */}
                    <Notification {...notification} />

                    {/* Содержимое вкладок */}
                    {activeTab === 'users' && (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Управление пользователями</h2>
                                <button className={styles.addButton}>
                                    Добавить пользователя
                                </button>
                            </div>

                            {/* Поиск */}
                            <SearchBar
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />

                            {/* Таблица пользователей */}
                            {loading ? (
                                <div className={styles.loader}>
                                    <div className={styles.spinner}></div>
                                </div>
                            ) : (
                                <>
                                    <UsersTable
                                        users={currentUsers}
                                        onUserUpdate={handleUserUpdate}
                                    />

                                    {/* Пагинация */}
                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalItems={filteredUsers.length}
                                            itemsPerPage={usersPerPage}
                                            onPageChange={setCurrentPage}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Управление правами доступа</h2>
                            <p className="mt-4">
                                Здесь будет содержимое для управления ролями и правами доступа.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;