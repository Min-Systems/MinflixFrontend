import React from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from "./AuthenticationForm";

const RegistrationPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Registration Page</h1> 
            <AuthenticationForm endpoint="http://localhost:8000/registration" />
            <button onClick={() => navigate('/')}>Go to Login</button>
        </div>
    );
};

export default RegistrationPage;
