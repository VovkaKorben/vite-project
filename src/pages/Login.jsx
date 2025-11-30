import React, { useEffect, useState } from "react";
import TextInput from '../comps/TextInput.jsx';
import Btn from '../comps/Btn.jsx';
import { API_BASE_URL } from '../consts.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {

    const [errorMessage, setErrorMessage] = useState('');

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setLogin('');
        setPassword('');
    }, []);

    const handleSubmit = async (event) => {
        // disable button before processing
        const button = event.target;
        button.disabled = true;

        let resultMessage = '';
        try {
            if (!login.trim()) {
                resultMessage = 'Please, enter login'
            } else
                if (!password.trim()) {
                    resultMessage = 'Please, enter password'
                } else {
                    const resp = await fetch(`${API_BASE_URL}login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: JSON.stringify({
                            login: login,
                            password: password

                        })
                    });

                    const data = await resp.json();
                    if (resp.ok && data.success) {
                        authLogin(data.user);
                        navigate('/');
                    }
                    else {
                        resultMessage = data.error;

                    }
                }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setErrorMessage(resultMessage);
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
                value={password}
            />

            <Btn caption="login" clicked={handleSubmit} />
            <span className="error">  {errorMessage}</span>
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





