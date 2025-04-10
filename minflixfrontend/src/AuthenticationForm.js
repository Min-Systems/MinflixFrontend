import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { login, register } from './Network'; // Import the API functions
import 'boxicons'

const AuthenticationForm = ({ isLogin = false }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleShowPasswordChange = (event) => {
        setShowPassword(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!isLogin && password !== confirmPassword) {
            alert('Passwords do not match!');
            setIsLoading(false);
            return;
        }

        try {
            // Use the appropriate API function based on form type
            const authFunction = isLogin ? login : register;
            const token = await authFunction(username, password);
            
            console.log("Authentication successful!");
            
            // Store the token
            localStorage.setItem('authToken', token);
            
            // Navigate to profiles page
            navigate('/profiles');

        } catch (error) {
            console.error('Authentication error:', error);
            alert(`Authentication failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form id='registrationForm' onSubmit={handleSubmit}>
            
            <div class = "input-box">
             
          {/*      <label htmlFor='username'>Email: <i class='bx bxs-user'></i></label>  */}
                <input
                    type='email'
                    id='username'
                    name='username'
                    placeholder='Email'
                    
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                />
                 <i class='bx bx-user'></i> 
            </div>
            
            <div class = "input-box">
            {/*    <label htmlFor='password'>Password:</label> */}
                <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
                <i class='bx bxs-user'></i>
            </div>
            
            {!isLogin && (
                <div class = "input-box">
                  {/*  <label htmlFor='confirmPassword'>Confirm Password:</label> */}
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='confirmPassword'
                        placeholder='Confirm Password'
                        
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
            )}
            <div class = "show-password">
                <input
                    id='showPassword'
                    type='checkbox'
                    checked={showPassword}
                    onChange={handleShowPasswordChange}
                    disabled={isLoading}
                />
                <label htmlFor='showPassword'> Show Password </label>
            </div>
            <p>
                <button type='submit' disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
            </p>
        </form>
    );
};

export default AuthenticationForm;