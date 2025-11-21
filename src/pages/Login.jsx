import React, { useEffect, useState } from "react";
import TextInput from '../comps/TextInput.jsx';
import Btn from '../comps/Btn.jsx';
import { API_BASE_URL, LOCALSTORAGE_TOKEN } from '../consts.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [message, setMessage] = useState('');

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const clicked = async (event) => {
        const button = event.target;

        button.disabled = true;
        let resultMessage = '';
        // resultMessage = `${login} ${password}`;
        try {


            const resp = await fetch(`${API_BASE_URL}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    login: login,
                    password: password

                })
            });
            const data = await resp.json();
            if (data.success === true) {
                // login OK,store token
                localStorage.setItem(LOCALSTORAGE_TOKEN, data.token);

                navigate('/'); // <-- Перенаправляем на маршрут /home
                return; // Прерываем дальнейшее выполнение функции
            }
            else {
                resultMessage = data.error;

            }


        } catch (error) {
            console.error('Error:', error);
        } finally {
            setMessage(resultMessage);
            button.disabled = false;
        }
    };
    return (
        <>Login
            <TextInput
                placeholder="login"
                changed={(tag, text) => setLogin(text)}
                value={login}
            />
            <TextInput
                placeholder="password"

                changed={(tag, text) => setPassword(text)}
                value={password} />
            <Btn caption="login"
                clicked={clicked}

            />
            <br />            {message}
        </>



    );
};

export default Login;



// check all values ok

/*
            const resp = await fetch(`${API_BASE_URL}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    login: values.login,
                    password: values.pass1
 
                })
            });
            const data = await resp.json();
            console.log(JSON.stringify(data));
            */
/*
            if (!data.success) {
                setDBError(data.message);
            } else {
                // navigate to "ok. email was sent."
 
            }
*/





