import React, { useContext, useState } from 'react';
import AuthContext from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react"; // оставляем иконки
import style from "../styles/Verification.module.css";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";


const Verification = () => {
    const location = useLocation();
    const email = location.state?.email;
    const [code, setCode] = useState('');
    const { verifyCode } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [status, setStatus] = useState('waiting'); // 'waiting' | 'success' | 'error'

    const handleSubmit = async () => {
        if (!email) {
            console.error("No email found.");
            setStatus('error');
            setError('Email не найден');
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
            setError('Ошибка верификации! Пожалуйста, попробуйте снова.');
            console.error('Verification failed:', err);
        }
    };

    const handleResend = () => {
        setStatus('waiting');
        setError('');
        console.log('Resending verification code');
        // Здесь должна быть логика повторной отправки кода
    };

    return (
        <>
            <Navbar />
        <div className={style.container}>
            <div className={style.card}> {/* Используем div вместо Card */}
                <div className={style.cardHeader}> {/* Используем div вместо CardHeader */}
                    <h2 className={style.title}>Confirm your email</h2> {/* CardTitle */}
                </div>
                <div className={style.cardContent}> {/* Используем div вместо CardContent */}
                    <div className={style.content}>
                        <p className={style.text}>
                            We have sent a confirmation code to your email.<br/>
                            Please enter it below.
                        </p>
                        {status === 'success' && (
                            <div className={style.success}>
                                <CheckCircle className={style.icon} />
                                    <span>Email successfully confirmed!</span>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className={style.error}>
                                <XCircle className={style.icon} />
                                <span>{error || 'Invalid code. Try again.'}</span>
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Confirmation code"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={style.input}
                        />
                        <button onClick={handleSubmit} className={style.button}>Confirm</button>
                        <div className={style.resendContainer}>
                            <button onClick={handleResend} className={style.resendButton}>
                                Resend code
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
