import React from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from "./AuthenticationForm";

const RegistrationPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Registration Page</h1> 
            <AuthenticationForm endpoint="https://minflixbackend-611864661290.us-west2.run.app/registration" />
            <button onClick={() => navigate('/')}>Go to Login</button>
        </div>
    );
};

export default RegistrationPage;
