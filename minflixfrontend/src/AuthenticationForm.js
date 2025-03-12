import React, { useState } from 'react';

const AuthenticationForm = ({ endpoint }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPasswordChange = (event) => {
        setShowPassword(event.target.checked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData = new FormData(event.target);

        /*
        fetch(endpoint, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        */
        fetch(endpoint, {
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
                const { access_token } = data;
                console.log("data");
                console.log(access_token);
                // Store the token in localStorage or sessionStorage
                localStorage.setItem('token', access_token);
                // Redirect or update UI as needed
            })
            .catch(error => {
                console.error('Login failed', error);
            });

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
                <button type='submit'>Submit</button>
            </p>
        </form>
    );
};

export default AuthenticationForm;
