import React from 'react';
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <p>
                <label htmlFor='registration'>Go to Registration Page</label>
                <button id="registration" type="button" onClick={() => {navigate("/registration")}}/>
            </p>
            <p>
                <label htmlFor='login'>Go to Login Page</label>
                <button id="login" type="button" onClick={() => {navigate("/login")}}/>
            </p>
        </div>
    );
};

export default FrontPage;