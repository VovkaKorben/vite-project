import React from "react";
import TextInput from '../comps/TextInput.jsx';
import Btn from '../comps/Btn.jsx';

const Login = () => {

    const [message, setMessage] = useState('');

    return (
        <>Login
            <TextInput placeholder="login" />
            <TextInput placeholder="password" />
            <Btn caption="login" /> <br />
            message: {message}
        </>



    );
};

export default Login;