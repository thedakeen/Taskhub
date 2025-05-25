import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <button className="button" onClick={() => setDarkMode(!darkMode)}>
            Switch to {darkMode ? 'Light' : 'Dark'} Theme
        </button>
    );
};

export default ThemeToggle;
