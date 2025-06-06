import React, { createContext, useContext, useState } from "react";
import en from "../locales/en/index";
import ru from "../locales/ru/index";
import kz from "../locales/kz/index";

const translations = { en, ru,kz };

export const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
    const [locale, setLocale] = useState("en");

    const t = (key) => {
        const keys = key.split(".");
        let result = translations[locale];
        for (const k of keys) {
            result = result?.[k];
        }
        return result || key;
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
};
