import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import AuthContext from "../contexts/AuthContext";
import style from "../styles/LoginSignup.module.css";
import { I18nContext } from '../contexts/i18nContext';  // <-- импорт контекста локализации

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const { signUp, verificationCodeSent } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useContext(I18nContext);  // функция для перевода из контекста

    useEffect(() => {
        if (verificationCodeSent) {
            navigate('/signup/verification', { state: { email } });
        }
    }, [verificationCodeSent, email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setError(t('passwords_do_not_match'));
            return;
        }
        if (password.length < 6) {
            setError(t('password_too_short'));
            return;
        }
        setError('');
        const result = await signUp(email, password, username);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className={style.login_container}>
                <h1>{t('fill_form')}</h1>
                <div className={style.login_body}>
                    <form onSubmit={handleSubmit}>
                        {error && <div className={style.error_message}>{error}</div>}
                        <input
                            type="text"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('email')}
                            required
                        />
                        <input
                            type="text"
                            value={username}
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('username')}
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('password')}
                            required
                        />
                        <input
                            type="password"
                            value={repeatPassword}
                            name="repeatPassword"
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            placeholder={t('repeat_password')}
                            required
                        />
                        <button type="submit">{t('sign_up')}</button>
                        <div className={style.login_footer}>
                            <Link to="/signIn" className={style.sign_in}>
                                {t('sign_in')}
                            </Link>
                            <Link to="/forgot-password" className={style.forgot_password}>
                                {t('forgot_password')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignUp;
