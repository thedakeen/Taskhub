import {useContext, useEffect, useState} from "react";
import {Building2, Search, User} from "lucide-react";
import styles from "../styles/AdminPAnetl.module.css";
import AuthContext from "../contexts/AuthContext";
import useCompanies from "../hooks/useCompanies";


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
                    <UserTableRow key={user.id} currUser={user} onUserUpdate={onUserUpdate} />
                ))}
                </tbody>
            </table>
        </div>
    );
};


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

const UserTableRow = ({ currUser, onUserUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {user} = useContext(AuthContext);

    const handleSave = async (userId, data) => {
        try {
            const response = await fetch(`/admin/update-user-role/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении роли' + response);
            }

            
            onUserUpdate(userId, data);
            setIsModalOpen(false);
            window.location.reload();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    return (
        <>
            <tr className={styles.tableRow}>
                <td className={styles.tableCell}>{currUser.id}</td>
                <td className={`${styles.tableCell} text-blue-500 font-medium`}>{currUser.username}</td>
                <td className={styles.tableCell}>{currUser.email}</td>
                <td className={styles.tableCell}>{currUser.role}</td>
                <td className={styles.tableCell}>{new Date(currUser.createdAt).toLocaleDateString()}</td>
                <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${
                        currUser.activated ? styles.statusAdmin : styles.statusUser
                    }`}>
                        {currUser.activated ? 'Активирован' : 'Не активирован'}
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
                    currUser={currUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

const UserEditModal = ({ currUser, onClose }) => {
    // const [role, setRole] = useState(currUser.role);
    const {user} = useContext(AuthContext);
    const [companyId, setCompanyId] = useState(currUser?.companyId || 0);
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useContext(AuthContext); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8090/admin/update-user-role/${currUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ companyId, role:"company" })
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка: ${response.status}`);
            }

            onClose();
            window.location.reload();

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


const CompaniesTable = ({ companies }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                <tr>
                    <th className={styles.tableHeaderCell}>ID</th>
                    <th className={styles.tableHeaderCell}>Название</th>
                    <th className={styles.tableHeaderCell}>Описание</th>
                    <th className={styles.tableHeaderCell}>Вебсайт</th>
                    <th className={styles.tableHeaderCell}>Дата создания</th>
                    <th className={styles.tableHeaderCell}>Действия</th>
                </tr>
                </thead>
                <tbody className={styles.tableBody}>
                {companies.map(company => (
                    <CompanyTableRow key={company.companyId} company={company}  />
                ))}
                </tbody>
            </table>
        </div>
    );
};

const CompanyTableRow = ({ company }) => {
    const {user} = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = async (companyId, data) => {
        try {
            const response = await fetch(`http://localhost:8090/admin/update-company/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении компании');
            }

            setIsModalOpen(false);
            window.location.reload();

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    return (
        <>
            <tr className={styles.tableRow}>
                <td className={styles.tableCell}>{company.companyId}</td>
                <td className={`${styles.tableCell} text-blue-500 font-medium`}>{company.companyName}</td>
                <td className={styles.tableCell}>{company.description}</td>
                <td className={styles.tableCell}>{company.website}</td>
                <td className={styles.tableCell}>{new Date(company.createdAt).toLocaleDateString()}</td>
                <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Редактировать
                        </button>
                    </div>
                </td>
            </tr>

            {isModalOpen && (
                <CompanyEditModal
                    company={company}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

const CompanyEditModal = ({ company, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: company.companyName,
        description: company.description,
        website: company.website,
        logo: company.logo
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(company.companyId, formData);
        } catch (err) {
            console.error('Ошибка при обновлении компании:', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Название компании:</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Вебсайт:</label>
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Логотип (URL):</label>
                        <input
                            type="text"
                            name="logo"
                            value={formData.logo}
                            onChange={handleChange}
                        />
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


const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const { companies } = useCompanies();
    const [fullCompanies, setFullCompanies] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useContext(AuthContext);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState({show: false, message: "", type: ""});
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('adminPanelActiveTab') || 'users'
    );

    const itemsPerPage = 5;

    useEffect(() => {
        localStorage.setItem('adminPanelActiveTab', activeTab);
    }, [activeTab]);
    const handleUserUpdate = (userId, newData) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? {...user, role: newData.role} : user
            )
        );
        setFilteredUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? {...user, role: newData.role} : user
            )
        );
        showNotification('Роль пользователя успешно обновлена', 'success');
    };

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const usersResponse = await fetch('http://localhost:8090/admin', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    }
                });

                if (!usersResponse.ok) {
                    throw new Error(`HTTP error! status: ${usersResponse.status}`);
                }
                const usersData = await usersResponse.json();
                setUsers(usersData);
                setFilteredUsers(usersData);

            } catch (error) {
                console.error('Fetch error:', error);
                showNotification(`Ошибка доступа: ${error.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    
    useEffect(() => {
        if (activeTab === 'users') {
            const filtered = users.filter(user =>
                user.username.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                user.role.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else if (activeTab === 'companies') {

        }
        setCurrentPage(1);
    }, [searchText, users, companies, activeTab]);

    useEffect(() => {
        const loadAllData = async () => {
            if (companies.length > 0) {

                const fullData = await Promise.all(
                    companies.map(async (company) => {
                        const details = await fetchFullCompanyData(company.companyId);
                        return { ...company, ...details }; 
                    })
                );

                setFullCompanies(fullData.filter(Boolean)); 
            }
        };

        loadAllData();
    }, [companies, searchText]);  
    
    const showNotification = (message, type = "info") => {
        setNotification({show: true, message, type});
        setTimeout(() => {
            setNotification({show: false, message: "", type: ""});
        }, 3000);
    };

    const fetchFullCompanyData = async (companyId) => {
        try {
            const response = await fetch(`http://localhost:8082/v1/companies/${companyId}`,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
            if (!response.ok) throw new Error('Ошибка загрузки');
            return await response.json(); 
        } catch (error) {
            console.error(`Не получилось загрузить компанию ${companyId}:`, error);
            return null;
        }
    };

    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const currentCompanies = fullCompanies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(
        activeTab === 'users'
            ? filteredUsers.length / itemsPerPage
            : fullCompanies.length / itemsPerPage
    );

    return (
        <>
            {user?.role !== "admin" ? (
                <div className={styles.adminLayout}>
                    <div className={styles.mainContent}>
                        <main className={styles.content}>
                            <Notification {...notification} />

                            {/* Табы для переключения между пользователями и компаниями */}
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('users')}
                                >
                                    <User size={16} className={styles.tabIcon} />
                                    Пользователи
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === 'companies' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('companies')}
                                >
                                    <Building2 size={16} className={styles.tabIcon} />
                                    Компании
                                </button>
                            </div>

                            {activeTab === 'users' && (
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h2 className={styles.cardTitle}>Управление пользователями</h2>
                                        <button className={styles.addButton}>
                                            Добавить пользователя
                                        </button>
                                    </div>

                                    <SearchBar
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        placeholder="Поиск пользователей..."
                                    />

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

                                            {totalPages > 1 && (
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    totalItems={filteredUsers.length}
                                                    itemsPerPage={itemsPerPage}
                                                    onPageChange={setCurrentPage}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === 'companies' && (
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h2 className={styles.cardTitle}>Управление компаниями</h2>
                                        <button className={styles.addButton}>
                                            Добавить компанию
                                        </button>
                                    </div>

                                    <SearchBar
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        placeholder="Поиск компаний..."
                                    />

                                    {loading ? (
                                        <div className={styles.loader}>
                                            <div className={styles.spinner}></div>
                                        </div>
                                    ) : (
                                        <>
                                            <CompaniesTable
                                                companies={currentCompanies}  
                                            />

                                            {totalPages > 1 && (
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    totalItems={fullCompanies.length}
                                                    itemsPerPage={itemsPerPage}
                                                    onPageChange={setCurrentPage}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            ) : (
                <div>
                    Только администратор может просматривать эту страницу
                </div>
            )}
        </>
    );
};

export default AdminPanel;