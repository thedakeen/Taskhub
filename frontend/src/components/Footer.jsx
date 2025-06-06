import React, {useContext} from 'react';
import '../App.css'
import {I18nContext} from "../contexts/i18nContext";

const Footer = () => {
    const { t } = useContext(I18nContext);

    return (
        <footer className="footer body" style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        }}>
            <p style={{ color: "var(--text-color)" }}>
                &copy; 2025 Task Hub. {t("all_rights_reserved")}
            </p>
        </footer>

    );
}

export default Footer;