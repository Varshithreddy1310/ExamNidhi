/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Ensure cookies are sent with every request
axios.defaults.withCredentials = true;

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Handle Theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Check login state
    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await axios.get(`${backendUrl}/papers/me`);
                setUser(res.data);
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (identifier, password) => {
        const res = await axios.post(`${backendUrl}/auth/login`, { identifier, password });
        setUser(res.data.user);
        return res.data;
    };

    const register = async (userData) => {
        const res = await axios.post(`${backendUrl}/auth/register`, userData);
        return res.data;
    };

    const logout = async () => {
        await axios.delete(`${backendUrl}/auth/logout`);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, loading, login, register, logout, backendUrl, theme, toggleTheme, setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
