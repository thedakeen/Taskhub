import React, {useContext} from 'react';
import { AlertTriangle, Lock, Ban, Server, Wifi, Clock, Shield, X } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import {useNavigate} from "react-router-dom";
import {I18nContext} from "../contexts/i18nContext";

const ErrorHandler = ({ error, onClose, isModal = false }) => {
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useContext(I18nContext);

    const getErrorInfo = (code) => {
        const errorMap = {
            400: {
                title: t("error.400.title"),
                message: t("error.400.message"),
                icon: AlertTriangle,
                type: 'warning'
            },
            401: {
                title: t("error.401.title"),
                message: t("error.401.message"),
                icon: Lock,
                type: 'info',
            },
            403: {
                title: t("error.403.title"),
                message: t("error.403.message"),
                icon: Shield,
                type: 'error'
            },
            404: {
                title: t("error.404.title"),
                message: t("error.404.message"),
                icon: Ban,
                type: 'default'
            },
            500: {
                title: t("error.500.title"),
                message: t("error.500.message"),
                icon: Server,
                type: 'error'
            },
            NETWORK_ERROR: {
                title: t("error.network.title"),
                message: t("error.network.message"),
                icon: Wifi,
                type: 'error'
            },
            TIMEOUT: {
                title: t("error.timeout.title"),
                message: t("error.timeout.message"),
                icon: Clock,
                type: 'warning'
            }
        };

        return errorMap[code] || {
            title: t("error.default.title"),
            message: t("error.default.message", { code }),
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

    
    return errorContent;
};


export default ErrorHandler;