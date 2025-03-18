import React from "react";
import { useNavigate } from 'react-router-dom';
import AuthenticationForm from './AuthenticationForm'

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Login Page</h1>
            <AuthenticationForm isLogin={true} />
            <button onClick={() => navigate('/register')}>Go to Registration</button>
        </div>
    );
}

export default LoginPage;