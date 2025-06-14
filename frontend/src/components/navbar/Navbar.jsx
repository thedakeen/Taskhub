import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { I18nContext } from "../../contexts/i18nContext";
import AuthContext from "../../contexts/AuthContext";
import "./Navbar.css";
import { Moon, Sun, Globe, ChevronDown, Menu, X } from "lucide-react";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const { locale, setLocale, t } = useContext(I18nContext);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'kz', name: 'Қазақша', flag: '🇰🇿' }
    ];

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const handleLanguageChange = (langCode) => {
        setLocale(langCode);
        setIsLangDropdownOpen(false);
    };

    const toggleMobileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Закрываем dropdown при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-selector')) {
                setIsLangDropdownOpen(false);
            }
            if (!event.target.closest('.mobile-menu') && !event.target.closest('.burger-menu')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Блокируем скролл при открытом мобильном меню
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="nav-link logo-link" onClick={closeMobileMenu}>
                    <div className="logo-container">
                        <svg width="35" height="35" viewBox="0 0 342 381" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M162.478 338.935C162.478 343.353 166.059 346.935 170.478 346.935C174.896 346.935 178.478 343.353 178.478 338.935L162.478 338.935ZM178.478 38.9352C178.478 34.5169 174.896 30.9352 170.478 30.9352C166.059 30.9352 162.478 34.5169 162.478 38.9352L178.478 38.9352ZM178.478 338.935L178.478 38.9352L162.478 38.9352L162.478 338.935L178.478 338.935Z"
                                fill="#AF52DE"/>
                            <path
                                d="M297.471 271.86C301.296 274.072 306.19 272.766 308.402 268.941C310.615 265.117 309.308 260.223 305.484 258.011L297.471 271.86ZM44.4837 107.011C40.6594 104.798 35.7655 106.105 33.5529 109.929C31.3403 113.753 32.647 118.647 36.4713 120.86L44.4837 107.011ZM305.484 258.011L44.4837 107.011L36.4713 120.86L297.471 271.86L305.484 258.011Z"
                                fill="#AF52DE"/>
                            <path
                                d="M305.484 120.86C309.308 118.647 310.615 113.753 308.402 109.929C306.19 106.105 301.296 104.798 297.471 107.011L305.484 120.86ZM36.4714 258.011C32.647 260.223 31.3404 265.117 33.5529 268.941C35.7655 272.766 40.6594 274.072 44.4838 271.86L36.4714 258.011ZM297.471 107.011L36.4714 258.011L44.4838 271.86L305.484 120.86L297.471 107.011Z"
                                fill="#AF52DE"/>
                            <path
                                d="M309.478 113.935C309.478 109.517 305.896 105.935 301.478 105.935C297.059 105.935 293.478 109.517 293.478 113.935H309.478ZM293.478 264.935C293.478 269.353 297.059 272.935 301.478 272.935C305.896 272.935 309.478 269.353 309.478 264.935H293.478ZM293.478 113.935V264.935H309.478V113.935H293.478Z"
                                fill="#4A90E2"/>
                            <path
                                d="M48.4771 120.935C48.4771 116.517 44.8953 112.935 40.4771 112.935C36.0588 112.935 32.4771 116.517 32.4771 120.935H48.4771ZM32.4771 271.935C32.4771 276.353 36.0588 279.935 40.4771 279.935C44.8953 279.935 48.4771 276.353 48.4771 271.935H32.4771ZM32.4771 120.935L32.4771 271.935H48.4771L48.4771 120.935H32.4771Z"
                                fill="#4A90E2"/>
                            <path
                                d="M36.2324 114.154C32.4873 116.498 31.3517 121.435 33.696 125.18C36.0402 128.925 40.9766 130.061 44.7217 127.716L36.2324 114.154ZM175.722 45.7163C179.467 43.372 180.602 38.4356 178.258 34.6905C175.914 30.9454 170.977 29.8098 167.232 32.1541L175.722 45.7163ZM44.7217 127.716L175.722 45.7163L167.232 32.1541L36.2324 114.154L44.7217 127.716Z"
                                fill="#4A90E2"/>
                            <path
                                d="M166.233 337.154C162.488 339.498 161.352 344.435 163.696 348.18C166.041 351.925 170.977 353.06 174.722 350.716L166.233 337.154ZM305.722 268.716C309.467 266.372 310.603 261.436 308.259 257.691C305.914 253.945 300.978 252.81 297.233 255.154L305.722 268.716ZM174.722 350.716L305.722 268.716L297.233 255.154L166.233 337.154L174.722 350.716Z"
                                fill="#4A90E2"/>
                            <path
                                d="M166.602 350.933C170.467 353.074 175.335 351.676 177.476 347.811C179.617 343.946 178.219 339.077 174.354 336.937L166.602 350.933ZM44.3535 264.937C40.4885 262.796 35.6199 264.194 33.4792 268.059C31.3386 271.924 32.7365 276.793 36.6015 278.933L44.3535 264.937ZM174.354 336.937L44.3535 264.937L36.6015 278.933L166.602 350.933L174.354 336.937Z"
                                fill="#4A90E2"/>
                            <path
                                d="M297.21 127.702C300.946 130.059 305.887 128.94 308.244 125.203C310.601 121.466 309.483 116.526 305.746 114.169L297.21 127.702ZM175.746 32.1688C172.009 29.8116 167.068 30.9302 164.711 34.6672C162.354 38.4041 163.473 43.3444 167.21 45.7016L175.746 32.1688ZM305.746 114.169L175.746 32.1688L167.21 45.7016L297.21 127.702L305.746 114.169Z"
                                fill="#4A90E2"/>
                            <path
                                d="M146.321 232.658C122.107 219.383 113.24 188.992 126.515 164.778C139.79 140.564 170.181 131.697 194.395 144.972C218.609 158.247 227.477 188.638 214.201 212.852C200.926 237.066 170.535 245.934 146.321 232.658Z"
                                fill="#AF52DE"/>
                            <circle cx="170.782" cy="340.239" r="40" transform="rotate(118.734 170.782 340.239)"
                                    fill="#4A90E2"/>
                            <circle cx="170.782" cy="40.2393" r="40" transform="rotate(118.734 170.782 40.2393)"
                                    fill="#4A90E2"/>
                            <circle cx="301.782" cy="115.239" r="40" transform="rotate(118.734 301.782 115.239)"
                                    fill="#4A90E2"/>
                            <circle cx="39.9932" cy="113.451" r="35" transform="rotate(118.734 39.9932 113.451)"
                                    fill="#4A90E2"/>
                            <circle cx="40.7813" cy="115.239" r="40" transform="rotate(118.734 40.7813 115.239)"
                                    fill="#4A90E2"/>
                            <circle cx="301.782" cy="266.239" r="40" transform="rotate(118.734 301.782 266.239)"
                                    fill="#4A90E2"/>
                            <circle cx="40.7813" cy="266.239" r="40" transform="rotate(118.734 40.7813 266.239)"
                                    fill="#4A90E2"/>
                        </svg>
                        <span className="logo-text">TaskHub</span>
                    </div>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-center desktop-only">
                <li><Link to="/" className="nav-link">{t("home")}</Link></li>
                <li><Link to="/companies" className="nav-link">{t("companies")}</Link></li>
            </div>

            <div className="nav-right">
                {/* Desktop Controls */}
                <div className="desktop-controls">
                    <li className="theme-toggle-btn" onClick={toggleTheme}>
                        {theme === "dark" ? <Sun size={20} style={{color:"white"}}/> : <Moon size={20} style={{color:"white"}}/>}
                    </li>

                    <li className="language-selector">
                        <button
                            className="language-button"
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            aria-expanded={isLangDropdownOpen}
                            aria-haspopup="true"
                        >
                            <Globe size={16} className="globe-icon" />
                            <span className="current-lang-flag">{currentLanguage.flag}</span>
                            <span className="current-lang-code">{currentLanguage.code.toUpperCase()}</span>
                            <ChevronDown
                                size={14}
                                className={`chevron-icon ${isLangDropdownOpen ? 'rotated' : ''}`}
                            />
                        </button>

                        {isLangDropdownOpen && (
                            <div className="language-dropdown">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`language-option ${locale === lang.code ? 'active' : ''}`}
                                        onClick={() => handleLanguageChange(lang.code)}
                                    >
                                        <span className="lang-flag">{lang.flag}</span>
                                        <span className="lang-name">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </li>

                    {user ? (
                        <>
                            <li><Link to={`/profile/${user.id}`} className="nav-link">{t("profile")}</Link></li>
                            <li>
                                <Link to="#" className="nav-link" onClick={logOut}>{t("logout")}</Link>
                            </li>
                        </>
                    ) : (
                        <li><Link to="/signin" className="nav-link login-btn">{t("sign_in")}</Link></li>
                    )}
                </div>

                {/* Burger Menu Button */}
                <button
                    className="burger-menu mobile-only"
                    onClick={toggleMobileMenu}
                    style={{ pointerEvents: 'all' }}
                >
                    {isMobileMenuOpen ?
                        <X size={24} color="white" style={{ pointerEvents: 'none' }} /> :
                        <Menu size={24} color="white" style={{ pointerEvents: 'none' }} />
                    }
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-content">
                    <div className="mobile-nav-links">
                        <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
                            {t("home")}
                        </Link>
                        <Link to="/companies" className="mobile-nav-link" onClick={closeMobileMenu}>
                            {t("companies")}
                        </Link>

                        {user ? (
                            <>
                                <Link to={`/profile/${user.id}`} className="mobile-nav-link" onClick={closeMobileMenu}>
                                    {t("profile")}
                                </Link>
                                <Link to="#" className="mobile-nav-link" onClick={() => { logOut(); closeMobileMenu(); }}>
                                    {t("logout")}
                                </Link>
                            </>
                        ) : (
                            <Link to="/signin" className="mobile-nav-link login-btn-mobile" onClick={closeMobileMenu}>
                                {t("sign_in")}
                            </Link>
                        )}
                    </div>

                    <div className="mobile-controls">
                        <div className="mobile-control-item">
                            <span className="control-label">{t("theme") || "Тема"}</span>
                            <button className="mobile-theme-toggle" onClick={toggleTheme}>
                                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                                <span>{theme === "dark" ? "Light" : "Dark"}</span>
                            </button>
                        </div>

                        <div className="mobile-control-item">
                            <span className="control-label">{t("language") || "Язык"}</span>
                            <div className="mobile-language-selector">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`mobile-lang-btn ${locale === lang.code ? 'active' : ''}`}
                                        onClick={() => { handleLanguageChange(lang.code); closeMobileMenu(); }}
                                    >
                                        <span className="lang-flag">{lang.flag}</span>
                                        <span className="lang-name">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
        </nav>
    );
};

export default Navbar;