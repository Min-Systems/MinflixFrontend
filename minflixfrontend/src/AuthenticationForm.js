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

        const formData = new FormData(event.target);

        try {
            const requestOptions = {
                method: 'POST',
                body: formData,
                credentials: 'include'
            };

            const response = await fetch(endpoint, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Authentication failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            localStorage.setItem('authToken', data.token);

            navigate('/profiles')

        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    };

    return (
        <form id='registrationForm' onSubmit={handleSubmit}>
            <p>
                <label htmlFor='username'>Email:</label>
                <input
                    type='username'
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