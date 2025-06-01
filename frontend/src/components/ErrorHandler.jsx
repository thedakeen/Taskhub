import React, {useContext} from 'react';
import { AlertTriangle, Lock, Ban, Server, Wifi, Clock, Shield, X } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import {useNavigate} from "react-router-dom";

const ErrorHandler = ({ error, onClose, isModal = false }) => {
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const getErrorInfo = (code) => {
        const errorMap = {
            400: {
                title: 'Bad Request',
                message: 'Please check your input data and try again',
                icon: AlertTriangle,
                type: 'warning'

            },
            401: {
                title: 'Unauthorized',
                message: 'You need to log in or re-authenticate to access this resource',
                icon: Lock,
                type: 'info',
            },
            403: {
                title: 'Forbidden',
                message: 'You don\'t have permission to perform this action',
                icon: Shield,
                type: 'error'
            },
            404: {
                title: 'Not Found',
                message: 'The requested page or resource doesn\'t exist',
                icon: Ban,
                type: 'default'
            },
            405: {
                title: 'Method Not Allowed',
                message: 'The HTTP method used is not supported for this resource',
                icon: Ban,
                type: 'warning'
            },
            408: {
                title: 'Request Timeout',
                message: 'The server didn\'t receive the request within the time limit',
                icon: Clock,
                type: 'warning'
            },
            409: {
                title: 'Conflict',
                message: 'There was a conflict while processing your request',
                icon: AlertTriangle,
                type: 'warning'
            },
            410: {
                title: 'Gone',
                message: 'The requested resource has been permanently deleted',
                icon: Ban,
                type: 'default'
            },
            413: {
                title: 'Payload Too Large',
                message: 'The request data exceeds the maximum allowed size',
                icon: AlertTriangle,
                type: 'warning'
            },
            422: {
                title: 'Unprocessable Entity',
                message: 'The data failed validation on the server',
                icon: AlertTriangle,
                type: 'error'
            },
            429: {
                title: 'Too Many Requests',
                message: 'Rate limit exceeded, please try again later',
                icon: Clock,
                type: 'warning'
            },

            // 5xx Server Errors
            500: {
                title: 'Internal Server Error',
                message: 'Something went wrong on the server, please try again later',
                icon: Server,
                type: 'error'
            },
            501: {
                title: 'Not Implemented',
                message: 'The server doesn\'t support this functionality',
                icon: Server,
                type: 'default'
            },
            502: {
                title: 'Bad Gateway',
                message: 'The server received an invalid response from another server',
                icon: Server,
                type: 'error'
            },
            503: {
                title: 'Service Unavailable',
                message: 'The server is temporarily unavailable, please try again later',
                icon: Server,
                type: 'warning'
            },
            504: {
                title: 'Gateway Timeout',
                message: 'The server didn\'t receive a response in time',
                icon: Clock,
                type: 'warning'
            },

            // Network Errors
            'NETWORK_ERROR': {
                title: 'Network Error',
                message: 'Please check your internet connection and try again',
                icon: Wifi,
                type: 'error'
            },
            'TIMEOUT': {
                title: 'Request Timeout',
                message: 'The server is not responding, please try again later',
                icon: Clock,
                type: 'warning'
            }
        };

        return errorMap[code] || {
            title: 'Unknown Error',
            message: `An error occurred: ${code}`,
            icon: AlertTriangle,
            type: 'default'
        };
    };

    React.useEffect(() => {
        if (!error) return;

        const errorCode = error.status || error.code || error;
        const errorInfo = getErrorInfo(errorCode);

        if (errorCode === 401 && errorInfo.action) {
            errorInfo.action();
        }
    }, [error]);


    const getContainerStyle = (type) => {
        const styles = {
            error: {
                border: '2px solid #fecaca',
                backgroundColor: '#fef2f2'
            },
            warning: {
                border: '2px solid #fed7aa',
                backgroundColor: '#fff7ed'
            },
            info: {
                border: '2px solid #bfdbfe',
                backgroundColor: '#eff6ff'
            },
            default: {
                border: '2px solid #d1d5db',
                backgroundColor: '#f9fafb'
            }
        };
        return styles[type] || styles.default;
    };

    const getIconStyle = (type) => {
        const styles = {
            error: { color: '#ef4444' },
            warning: { color: '#f97316' },
            info: { color: '#3b82f6' },
            default: { color: '#6b7280' }
        };
        return styles[type] || styles.default;
    };

    const getTitleStyle = (type) => {
        const styles = {
            error: { color: '#991b1b' },
            warning: { color: '#9a3412' },
            info: { color: '#1e40af' },
            default: { color: '#1f2937' }
        };
        return styles[type] || styles.default;
    };

    const getMessageStyle = (type) => {
        const styles = {
            error: { color: '#dc2626' },
            warning: { color: '#ea580c' },
            info: { color: '#2563eb' },
            default: { color: '#4b5563' }
        };
        return styles[type] || styles.default;
    };

    const getCodeStyle = (type) => {
        const styles = {
            error: { color: '#f87171' },
            warning: { color: '#fb923c' },
            info: { color: '#60a5fa' },
            default: { color: '#9ca3af' }
        };
        return styles[type] || styles.default;
    };

    if (!error) return null;

    const errorCode = error.status || error.code || error;
    const errorInfo = getErrorInfo(errorCode);
    const IconComponent = errorInfo.icon;

    // Стили для модального окна
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    };

    const modalContainerStyle = {
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        ...getContainerStyle(errorInfo.type)
    };

    // Обычные стили для inline использования
    const inlineContainerStyle = {
        padding: '16px',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: '0 auto',
        position: 'relative',
        ...getContainerStyle(errorInfo.type)
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        padding: '4px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderRadius: '4px'
    };

    const flexContainerStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
    };

    const iconStyle = {
        width: '24px',
        height: '24px',
        marginTop: '4px',
        flexShrink: 0,
        ...getIconStyle(errorInfo.type)
    };

    const contentStyle = {
        flex: 1
    };

    const titleStyle = {
        fontWeight: '600',
        fontSize: '18px',
        marginBottom: '4px',
        ...getTitleStyle(errorInfo.type)
    };

    const messageStyle = {
        fontSize: '14px',
        marginBottom: '12px',
        ...getMessageStyle(errorInfo.type)
    };

    const codeStyle = {
        fontSize: '12px',
        ...getCodeStyle(errorInfo.type)
    };

    // Контент ошибки
    const errorContent = (
        <div style={isModal ? modalContainerStyle : inlineContainerStyle}>
            {onClose && (
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <X size={16} style={{color: '#666'}} />
                </button>
            )}
            <div style={flexContainerStyle}>
                <IconComponent style={iconStyle} />
                <div style={contentStyle}>
                    <h3 style={titleStyle}>
                        {errorInfo.title}
                    </h3>
                    <p style={messageStyle}>
                        {errorInfo.message}
                    </p>
                    <div style={codeStyle}>
                        Error code: {errorCode}
                    </div>
                </div>
            </div>
        </div>
    );

    // Если модальное окно - оборачиваем в overlay
    if (isModal) {
        return (
            <div
                style={overlayStyle}
                onClick={(e) => {
                    if (e.target === e.currentTarget && onClose) {
                        onClose();
                    }
                }}
            >
                {errorContent}
            </div>
        );
    }

    // Обычное inline отображение
    return errorContent;
};


export default ErrorHandler;