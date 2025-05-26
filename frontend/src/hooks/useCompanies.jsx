import {useState, useEffect, useContext} from "react";
import { User, Search, Lock, LogOut, Building2 } from "lucide-react";
import styles from "../styles/AdminPAnetl.module.css";
import AuthContext from "../contexts/AuthContext";
import useCompanies from "./useCompanies";

// ... (остальные компоненты Header, Notification, SearchBar, Pagination остаются без изменений)

// Новый компонент строки таблицы для компаний
const CompanyTableRow = ({ company, onCompanyUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <tr className={styles.tableRow}>
                <td className={styles.tableCell}>{company.companyId}</td>
                <td className={`${styles.tableCell} font-medium`}>{company.companyName}</td>
                <td className={styles.tableCell}>{company.description}</td>
                <td className={styles.tableCell}>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                        {company.website}
                    </a>
                </td>
                <td className={styles.tableCell}>
                    {new Date(company.createdAt).toLocaleDateString()}
                </td>
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
                    onSave={onCompanyUpdate}
                />
            )}
        </>
    );
};

// Новый компонент модального окна для редактирования компании
const CompanyEditModal = ({ company, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: company.companyName,
        description: company.description,
        website: company.website,
        logo: company.logo
    });
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8082/admin/update-company/${company.companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка: ${response.status}`);
            }

            const result = await response.json();
            onSave(company.companyId, result);
            onClose();
        } catch (err) {
            console.error('Ошибка при обновлении компании:', err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3 className={styles.modalTitle}>Редактирование компании</h3>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Название компании:</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Описание:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Вебсайт:</label>
                        <input
                            type="url"
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

// Новый компонент таблицы компаний
const CompaniesTable = ({ companies, onCompanyUpdate }) => {
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
                    <CompanyTableRow
                        key={company.companyId}
                        company={company}
                        onCompanyUpdate={onCompanyUpdate}
                    />
                ))}
                </tbody>
            </table>
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

    // Добавляем состояние для компаний
    const { companies, loading: companiesLoading, error: companiesError } = useCompanies();
    const [currentCompaniesPage, setCurrentCompaniesPage] = useState(1);
    const companiesPerPage = 5;

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

    // Новая функция для обновления компании
    const handleCompanyUpdate = (companyId, updatedCompany) => {
        showNotification('Компания успешно обновлена', 'success');
    };

    // ... (остальные функции useEffect, showNotification остаются без изменений)

    // Пагинация для компаний
    const indexOfLastCompany = currentCompaniesPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);
    const totalCompaniesPages = Math.ceil(companies.length / companiesPerPage);

    return (
        <div className={styles.adminLayout}>
            <div className={styles.mainContent}>
                <Header activeTab={activeTab} onTabChange={setActiveTab} />

                <main className={styles.content}>
                    <Notification {...notification} />

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

                    {/* Новая вкладка для управления компаниями */}
                    {activeTab === 'companies' && (
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>
                                    <Building2 size={20} className="mr-2" />
                                    Управление компаниями
                                </h2>
                            </div>

                            {companiesLoading ? (
                                <div className={styles.loader}>
                                    <div className={styles.spinner}></div>
                                </div>
                            ) : companiesError ? (
                                <div className={styles.errorMessage}>
                                    Ошибка загрузки компаний: {companiesError}
                                </div>
                            ) : (
                                <>
                                    <CompaniesTable
                                        companies={currentCompanies}
                                        onCompanyUpdate={handleCompanyUpdate}
                                    />

                                    {totalCompaniesPages > 1 && (
                                        <Pagination
                                            currentPage={currentCompaniesPage}
                                            totalPages={totalCompaniesPages}
                                            totalItems={companies.length}
                                            itemsPerPage={companiesPerPage}
                                            onPageChange={setCurrentCompaniesPage}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;