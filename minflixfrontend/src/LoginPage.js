import React from "react";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import AuthenticationForm from './AuthenticationForm'
import 'boxicons'
<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>


const LoginPage = () => {
    const navigate = useNavigate();

    return (
     <body>
        <div class = "wrapper">
            <h1>Login </h1>
            
            <AuthenticationForm isLogin={true} />


           {/* <button onClick={() => navigate('/register')}>Go to Registration</button>  */}
           <div class = "register-link">
            <p> Dont have an account?
            <a href="/register"> Register</a>
            </p>
           </div>
    
     
    
        </div>
     </body>
    );
}

export default LoginPage;