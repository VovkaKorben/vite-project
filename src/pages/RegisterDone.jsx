import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const RegisterDone = () => {

    const [email, setEmail] = useState('');

    useEffect(() => {
        const savedEmail = sessionStorage.getItem('registrationEmail');


        if (savedEmail) {
            setEmail(savedEmail);
            sessionStorage.removeItem('registrationEmail');
        } else {
            // navigate('/'); 
        }

    }, []);

    return (
        <>E-mail was sent to address {email}
        </>



    );
};

export default RegisterDone;
