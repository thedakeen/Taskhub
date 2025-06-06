import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/Routes';
import "./App.css"
import { I18nProvider } from "./contexts/i18nContext";

function App() {
    return (
        <I18nProvider>
            <AuthProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </I18nProvider>

    );
}

export default App;