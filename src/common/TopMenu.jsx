import React, { useEffect, useState } from "react";
import { API_BASE_URL, LOCALSTORAGE_TOKEN } from '../consts.js';
import { stringifyWithDepthLimit } from '../debug.js';

const TopMenu = () => {
    const [message, setMessage] = useState({});

    useEffect(() => {
        const get_token = async () => {
            const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
            // setMessage(token);
            const resp = await fetch(`${API_BASE_URL}token/${token}`, { method: 'GET' });

            const data = await resp.json();
            setMessage(data);
        }




        get_token();

    }, []);


    return (
        <>
            <div className="top-menu flex_row_distribute_center">
                <div>
                    <a href="/">main</a>
                </div>

                <div>
                    <a href="/login">login</a>
                    <a href="/register">register</a>
                </div>
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}> TopMenu:{stringifyWithDepthLimit(message, 2)}                </div>
        </>

    );
};

export default TopMenu;