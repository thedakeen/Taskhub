import { useState, useEffect } from "react";
import { User, Search, Lock, LogOut } from "lucide-react";
import styles from "../styles/AdminPAnetl.module.css";

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
const UsersTable = ({ users, onAdminChange }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                <tr>
                    <th className={styles.tableHeaderCell}>ID</th>
                    <th className={styles.tableHeaderCell}>Имя пользователя</th>
                    <th className={styles.tableHeaderCell}>Полное имя</th>
                    <th className={styles.tableHeaderCell}>Email</th>
                    <th className={styles.tableHeaderCell}>Дата регистрации</th>
                    <th className={styles.tableHeaderCell}>Статус</th>
                    <th className={styles.tableHeaderCell}>Права админа</th>
                    <th className={styles.tableHeaderCell}>Действия</th>
                </tr>
                </thead>
                <tbody className={styles.tableBody}>
                {users.map(user => (
                    <tr key={user.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{user.id}</td>
                        <td className={`${styles.tableCell} text-blue-500 font-medium`}>{user.username}</td>
                        <td className={styles.tableCell}>{user.name}</td>
                        <td className={styles.tableCell}>{user.email}</td>
                        <td className={styles.tableCell}>{user.createdAt}</td>
                        <td className={styles.tableCell}>
                <span className={`${styles.statusBadge} ${
                    user.isAdmin ? styles.statusAdmin : styles.statusUser
                }`}>
                  {user.isAdmin ? 'Администратор' : 'Пользователь'}
                </span>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.switchContainer}>
                                <button
                                    onClick={() => onAdminChange(user.id)}
                                    className={`${styles.switch} ${user.isAdmin ? styles.switchOn : styles.switchOff}`}
                                >
                                    <span className={`${styles.switchHandle} ${user.isAdmin ? styles.switchHandleOn : ''}`} />
                                </button>
                            </div>
                        </td>
                        <td className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                                <button className={`${styles.actionButton} ${styles.editButton}`}>
                                    Редактировать
                                </button>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`}>
                                    Удалить
                                </button>
                            </div>
                        </td>
                    </tr>
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

// Главный компонент админ-панели
const AdminPanel = () => {
    // Данные о пользователях
    const [users, setUsers] = useState([
        { id: 1, username: "ivan_petrov", name: "Иван Петров", email: "ivan@example.com", isAdmin: false, createdAt: "2024-03-15" },
        { id: 2, username: "elena_smirnova", name: "Елена Смирнова", email: "elena@example.com", isAdmin: true, createdAt: "2024-02-20" },
        { id: 3, username: "alex_kozlov", name: "Алексей Козлов", email: "alex@example.com", isAdmin: false, createdAt: "2024-04-05" },
        { id: 4, username: "natasha_ivanova", name: "Наталья Иванова", email: "natasha@example.com", isAdmin: false, createdAt: "2024-01-10" },
        { id: 5, username: "sergey_popov", name: "Сергей Попов", email: "sergey@example.com", isAdmin: true, createdAt: "2024-05-01" },
        { id: 6, username: "olga_kuznetsova", name: "Ольга Кузнецова", email: "olga@example.com", isAdmin: false, createdAt: "2024-01-25" },
        { id: 7, username: "dmitry_sokolov", name: "Дмитрий Соколов", email: "dmitry@example.com", isAdmin: false, createdAt: "2024-03-30" },
        { id: 8, username: "maria_volkova", name: "Мария Волкова", email: "maria@example.com", isAdmin: false, createdAt: "2024-04-12" },
    ]);

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [activeTab, setActiveTab] = useState('users');

    const usersPerPage = 5;

    // Имитация загрузки данных
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            setFilteredUsers(users);
        }, 1000);
    }, []);

    // Фильтрация по поисковому запросу
    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchText, users]);

    // Изменение прав администратора
    const handleAdminChange = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
        ));

        // Показать уведомление
        const affectedUser = users.find(user => user.id === userId);
        const newStatus = !affectedUser.isAdmin;

        showNotification(
            `Права администратора ${newStatus ? 'присвоены' : 'сняты'} для пользователя ${affectedUser.name}`,
            newStatus ? "success" : "info"
        );
    };

    // Пагинация
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Показать уведомление
    const showNotification = (message, type = "info") => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
    };

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
                                        onAdminChange={handleAdminChange}
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