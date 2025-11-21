
import React, { useEffect, useState } from "react";
import TextInput from '../comps/TextInput.jsx';
import Btn from '../comps/Btn.jsx';
import { API_BASE_URL } from '../consts.js';


const Register = () => {


    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [dbError, setDBError] = useState('');

    const fields = [
        { initial: 'aaa', tag: "login", label: 'User name', placeholder: "login", type: "text", re: /[a-z0-9_]{3,20}/i, error: 'Login must 3-20 alhpabet/numeric symbols' },
        { initial: 'bbb', tag: "pass1", label: 'Password', placeholder: "password", type: "password", re: /.+/, error: "Password must be 6-20 symbols, including special symbols" },
        { initial: 'bbb', tag: "pass2", label: 'Repeat password', placeholder: "repeat password", type: "password", re: /.+/, error: "Passwords doesnt match" },
        { initial: '123', tag: "phone", label: 'Phone', placeholder: "phone", type: "tel", re: /\d+/, error: "Phone?" },
        { initial: 'a@b', tag: "email", label: 'E-mail', placeholder: "email", type: "email", re: /.+/, error: "E-mail address not valid" }
    ];

    const resetErrors = () => {
        const initialErrors = {};
        for (const field of fields) {
            initialErrors[field.tag] = false;
        }
        return initialErrors;
    };

    useEffect(() => {
        console.log(`[useEffect errors] ${JSON.stringify(errors)}`);
    }, [errors]);

    useEffect(() => {
        const initialValues = {};
        for (const field of fields)
            // initialValues[field.tag] = "";
            initialValues[field.tag] = field.initial;// debug fields init
        setValues(initialValues);
        setErrors(resetErrors());
    }, []);

    const changed = (tag, value) => { setValues(prev => ({ ...prev, [tag]: value })) };

    const clicked = async (event) => {
        const button = event.target;

        button.disabled = true;
        const temp_errors = resetErrors();
        try {

            // check all values ok
            for (const field of fields) {

                // console.log(field.tag);
                if (field.tag === "pass2") {
                    // check both password identical
                    if (values.pass1 !== values.pass2) {
                        temp_errors.pass2 = true;
                        break;
                    }
                } else {
                    // check fields with regex
                    if (!(field.re.test(values[field.tag]))) {
                        temp_errors[field.tag] = true;
                        break;

                    }
                }


            };

            // count errors
            let errors_count = 0;
            Object.values(temp_errors).forEach(e => {
                if (e) errors_count++;
            });


            // put to db new user
            if (errors_count === 0) {

                const resp = await fetch(`${API_BASE_URL}register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({
                        login: values.login,
                        password: values.pass1,
                        email: values.email,
                        phone: values.phone

                    })
                });
                const data = await resp.json();
                console.log(JSON.stringify(data));

                if (!data.success) {
                    setDBError(data.message);
                } else {
                    // navigate to "ok. email was sent."

                }
            }






        } catch (error) {
            console.error('Error:', error);
        } finally {
            setErrors(temp_errors);
            button.disabled = false;
        }
    };

    return (
        <>Register
            {fields.map(field => (
                <TextInput
                    key={field.tag}
                    changed={changed}
                    type={field.type}
                    tag={field.tag}
                    placeholder={field.placeholder}
                    label={field.label}
                    error={errors[field.tag] ? field.error : ''}
                    initial={field.initial}
                />
            ))}

            <Btn clicked={clicked} caption="register" />
            {dbError}
        </>



    );
};

export default Register;