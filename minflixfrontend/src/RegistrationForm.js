import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleShowPasswordChange = (event) => {
        setShowPassword(event.target.checked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        fetch('http://localhost:8000/registration', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            setSuccess(true);
            // Redirect to profile creation after short delay
            setTimeout(() => {
                navigate('/create-profile');
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            setError('Registration failed. Please try again.');
        });
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="registration-container">
            <h2>Create an Account</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Registration successful! Redirecting to profile creation...</div>}
            <form id='registrationForm' onSubmit={handleSubmit}>
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
                    <label htmlFor='confirmPassword'>Confirm Password:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <button type='submit'>Register</button>
                </p>
            </form>
            <div className="login-link">
                <p>Already have an account?</p>
                <button onClick={navigateToLogin}>Login</button>
            </div>
        </div>
    );
};

export default RegistrationForm;