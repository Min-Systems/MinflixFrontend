import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthenticationForm = ({ endpoint, isLogin = false }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleShowPasswordChange = (event) => {
        setShowPassword(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isLogin && password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            // Create URLSearchParams for OAuth2 compatibility
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            
            console.log(`Submitting to: ${endpoint}`);
            console.log(`With username: ${username}`);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                credentials: 'include'
            });
            
            console.log(`Response status: ${response.status}`);

            if (!response.ok) {
                let errorMessage;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || `Authentication failed with status: ${response.status}`;
                } catch (e) {
                    errorMessage = `Authentication failed with status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            // Get the token from the response
            const token = await response.text();
            console.log("Authentication successful!");
            
            // Store the token
            localStorage.setItem('authToken', token);
            
            // Navigate to profiles page
            navigate('/profiles');

        } catch (error) {
            console.error('Authentication error:', error);
            alert(`Authentication failed: ${error.message}`);
        }
    };

    return (
        <form id='registrationForm' onSubmit={handleSubmit}>
            <p>
                <label htmlFor='username'>Email:</label>
                <input
                    type='email'
                    id='username'
                    name='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </p>
            <p>
                <label htmlFor='password'>Password:</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </p>
            {!isLogin && (
                <p>
                    <label htmlFor='confirmPassword'>Confirm Password:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </p>
            )}
            <p>
                <label htmlFor='showPassword'>Show Password </label>
                <input
                    id='showPassword'
                    type='checkbox'
                    checked={showPassword}
                    onChange={handleShowPasswordChange}
                />
            </p>
            <p>
                <button type='submit'>{isLogin ? 'Login' : 'Register'}</button>
            </p>
        </form>
    );
};

export default AuthenticationForm;