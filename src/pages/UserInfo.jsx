import React, { useEffect, useState } from "react";
import TextInput from '../comps/TextInput.jsx';
import Btn from '../comps/Btn.jsx';
import Editable from '../comps/Editable.jsx';
import { API_BASE_URL } from '../consts.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { stringifyWithDepthLimit } from '../debug.js';

const UserInfo = () => {
    const { user_id } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn, user, token } = useAuth();
    const [email, setEmail] = useState(null);
    const [requested, setRequested] = useState({})

    useEffect(() => {

        const getUserData = async () => {
            const resp = await fetch(`${API_BASE_URL}userinfo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    request_user_id: user_id,
                    token: token,


                })
            });
            const data = await resp.json();
            if (data.success) {
                const values = data.data;
                setRequested(values);
                setEmail(values.email);



            }
            else { setErrorMessage(data.error); }

            // setErrorMessage(JSON.stringify(data));
        };


        getUserData();






    }, []);


    return (
        <>requested data:<pre>{requested && stringifyWithDepthLimit(requested, 2)}</pre>
            {email && <Editable label="E-mail" initial={email} />}

            {/* <span className="error">  {errorMessage}</span> */}
        </>



    );
};

export default UserInfo;


