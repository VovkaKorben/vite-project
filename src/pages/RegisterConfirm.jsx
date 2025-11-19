import React, { useEffect, useState } from "react";
import { API_BASE_URL } from '../consts.js';
import { useParams } from 'react-router-dom';
const RegisterConfirm = () => {
    const [message, setMessage] = useState('');
    const { link } = useParams();

    useEffect(() => {

        const confirmRegistration = async () => {
            const resp = await fetch(`${API_BASE_URL}confirm&link=${link}`, {
                method: 'GET'
            });
            const data = await resp.json();
            console.log(JSON.stringify(data));

            if (!data.success) {
                setMessage(data.message);
            } else {
                // navigate to "ok. email was sent."

            }

        };


        confirmRegistration();






    }, []);



    return (
        <>
            link: {link}<br />
            message: {message}
        </>



    );
};

export default RegisterConfirm;