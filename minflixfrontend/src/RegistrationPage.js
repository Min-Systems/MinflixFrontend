import React from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from "./AuthenticationForm";
import './LoginPage.css';

const RegistrationPage = () => {
    const navigate = useNavigate();

    return (
        <div     class = "wrapper"        >
            <h1>Create Your Account </h1> 
            <AuthenticationForm isLogin={false} />
            
            <div class = "register-link">
            <p> Already have an account?
             <a href="/"> Login</a> 
            </p>
           </div>

        </div>
    );
};

export default RegistrationPage;
