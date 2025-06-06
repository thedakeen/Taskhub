import React, { useContext, useState } from 'react';
import AuthContext from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import style from "../styles/Verification.module.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import { I18nContext } from '../contexts/i18nContext';  // Импорт контекста локализации

const Verification = () => {
    const location = useLocation();
    const email = location.state?.email;
    const [code, setCode] = useState('');
    const { verifyCode } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [status, setStatus] = useState('waiting');
    const { t } = useContext(I18nContext);

    const handleSubmit = async () => {
        if (!email) {
            console.error("No email found.");
            setStatus('error');
            setError(t('email_not_found'));
            return;
        }
        try {
            await verifyCode(code, email);
            setStatus('success');
            setTimeout(() => {
                navigate('/signIn');
            }, 1500);
        } catch (err) {
            setStatus('error');
            setError(t('verification_error'));
            console.error('Verification failed:', err);
        }
    };

    const handleResend = () => {
        setStatus('waiting');
        setError('');
        console.log('Resending verification code');
        // Здесь можешь добавить логику повторной отправки кода
    };

    return (
        <>
            <Navbar />
            <div className={style.container}>
                <div className={style.card}>
                    <div className={style.cardHeader}>
                        <h2 className={style.title}>{t('confirm_email')}</h2>
                    </div>
                    <div className={style.cardContent}>
                        <div className={style.content}>
                            <p className={style.text}>
                                {t('confirmation_sent')}
                            </p>
                            {status === 'success' && (
                                <div className={style.success}>
                                    <CheckCircle className={style.icon} />
                                    <span>{t('email_confirmed')}</span>
                                </div>
                            )}
                            {status === 'error' && (
                                <div className={style.error}>
                                    <XCircle className={style.icon} />
                                    <span>{error || t('invalid_code')}</span>
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder={t('confirmation_code')}
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={style.input}
                            />
                            <button onClick={handleSubmit} className={style.button}>
                                {t('confirm')}
                            </button>
                            <div className={style.resendContainer}>
                                <button onClick={handleResend} className={style.resendButton}>
                                    {t('resend_code')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Verification;
