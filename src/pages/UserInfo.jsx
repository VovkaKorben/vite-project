import React, { useEffect, useState } from "react";
import TextInput from '../comps/TextInput.jsx';
import Btn from '../comps/Btn.jsx';
import { API_BASE_URL } from '../consts.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { stringifyWithDepthLimit } from '../debug.js';

const UserInfo = () => {
    const { user_id } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn, user, token } = useAuth();

    useEffect(() => {

        const getUserData = async () => {
            const resp = await fetch(`${API_BASE_URL}userinfo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    user_id: user_id,
                    token: token,


                })
            });
            const data = await resp.json();
            setErrorMessage(JSON.stringify(data));
            /*const resp = await fetch(`${API_BASE_URL}confirm&link=${link}`, {
                method: 'GET'
            });
            const data = await resp.json();
            console.log(JSON.stringify(data));

            if (!data.success) {
                setMessage(data.message);
            } else {
                // navigate to "ok. email was sent."

            }*/

        };


        getUserData();






    }, []);


    return (
        <>UserInfo
            {user && stringifyWithDepthLimit(user)}<br /><br />
            {token}<br /><br />
            <span className="error">  {errorMessage}</span>
        </>



    );
};

export default UserInfo;


