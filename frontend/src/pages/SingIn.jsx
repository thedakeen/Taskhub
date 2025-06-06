import React, {useState, useContext} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import Navbar from '../components/navbar/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import style from "../styles/LoginSignup.module.css";
import { I18nContext } from '../contexts/i18nContext';  // <-- импорт контекста локализации

const SignIn = () => {
    const { t } = useContext(I18nContext);  // функция для перевода из контекста

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await logIn(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className={style.login_container}>
                <h1>{t('welcome_back')}</h1>
                <div className={style.login_body}>
                    <form onSubmit={handleSubmit}>
                        {error && <div className={style.error_message}>{error}</div>}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('username')}
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('password')}
                            required
                        />
                        <button type="submit">{t('login')}</button>
                        <div className={style.login_footer}>
                            <Link to="/signup" className={style.signup}>{t('sign_up')}</Link>
                            <Link to="/forgot-password" className={style.forgot_password}>{t('forgot_password')}</Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignIn;

