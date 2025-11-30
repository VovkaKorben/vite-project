import React from "react";
import { API_BASE_URL, LOCALSTORAGE_TOKEN } from '../consts.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { stringifyWithDepthLimit } from '../debug.js';

const TopMenu = () => {
    // const [logged, setLogged] = useState(<></>);
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();
        logout();
        navigate('/');
    };


    const AuthLinks = () => {
        if (isLoggedIn) {
            return (
                <>
                    <a href={`/user/${user.id}`}> Logged as <b>{user?.login || 'Пользователь'}</b></a>
                    <a href="/logout" onClick={handleLogout}>logout</a>
                </>
            );
        } else {
            return (
                <>
                    <a href="/register">register</a>
                    <a href="/login">login</a>
                </>
            );
        }
    };


    return (<>
        <div className="top-menu ">
            <div className="flex_row_distribute_center">
                <div><a href="/">main</a></div>
                <div><AuthLinks /></div>
            </div>
            {user && stringifyWithDepthLimit(user)}
        </div>

        <br />
    </>);
};

export default TopMenu;