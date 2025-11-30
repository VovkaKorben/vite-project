import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL, LOCALSTORAGE_TOKEN } from './consts.js';

const AuthContext = createContext({
    isLoggedIn: false,
    user: null,
    login: () => { },
    logout: () => { }
});
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const isLoggedIn = !!user;
    const [token, setToken] = useState(localStorage.getItem(LOCALSTORAGE_TOKEN));

    useEffect(() => {
        // const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
        if (token) {
            const fetchUserData = async () => {
                const resp = await fetch(`${API_BASE_URL}token/${token}`, { method: 'GET' });
                const logged_user = await resp.json();

                if (logged_user.success) {
                    setUser(logged_user.data);
                } else {
                    localStorage.removeItem(LOCALSTORAGE_TOKEN);
                    setToken(null);
                }
            }
            fetchUserData();
        }
    }, [token]);

    const login = (user_data) => {
        const newToken = user_data?.access_token;

        if (!newToken) {
            console.error("Ошибка входа: Объект пользователя не содержит 'access_token'.");
            return;
        }
        localStorage.setItem(LOCALSTORAGE_TOKEN, newToken);
        setUser(user_data);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem(LOCALSTORAGE_TOKEN);
        setUser(null);
        setToken(null);
    };

    const value = { isLoggedIn, user, login, logout,token };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};