import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleShowPasswordChange = (event) => {
        setShowPassword(event.target.checked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // Create form data
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        // Send login request
        fetch('http://localhost:8000/login', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            // Redirect to profile selection page after successful login
            navigate('/profiles');
        })
        .catch(error => {
            console.error('Error:', error);
            setError('Invalid email or password. Please try again.');
        });
    };

    const navigateToRegistration = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <h2>Login to Minflix</h2>
            {error && <div className="error-message">{error}</div>}
            <form id='loginForm' onSubmit={handleSubmit}>
                <p>
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <button type='submit'>Login</button>
                </p>
            </form>
            <div className="registration-link">
                <p>Don't have an account?</p>
                <button onClick={navigateToRegistration}>Register</button>
            </div>
        </div>
    );
};

export default LoginForm;