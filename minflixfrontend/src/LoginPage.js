import React from "react";
import AuthenticationForm from "./AuthenticationForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={() => navigate('/register')}>Go to Registration</button>
        </div>
    );
};

export default LoginPage;
