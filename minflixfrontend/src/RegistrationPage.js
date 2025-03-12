import React from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from "./AuthenticationForm";

const RegistrationPage = () => {
    const navigate = useNavigate();

    return (
        <div>
           <h1>Registration Page</h1> 
            <button onClick={() => navigate('/login')}>Go to Registration</button>
        </div>
    );
};

export default RegistrationPage;
