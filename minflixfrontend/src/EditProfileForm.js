import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { editProfile, isTokenValid } from './Network';

const EditProfileForm = ({ loadProfile }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const navigate = useNavigate();

    const profileFormStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #ccc',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        zIndex: 1000
    };

    const buttonStyle = {
        float: 'right',
        width: '100px',
        height: '100px',
        backgroundColor: 'gray',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    }

    const handleEditProfileSubmit = async (event) => {
        event.preventDefault();

        try {
            // Check token validity before attempting request
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Use the API function from network.js
            const newToken = await editProfile(displayName, newDisplayName);

            // Success!
            localStorage.setItem('authToken', newToken);

            setDisplayName('');
            setNewDisplayName('');
            loadProfile();
            setIsVisible(false);
        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }
    };

    return (
        <div id='editProfileFormComponent'>
            <button style={buttonStyle} onClick={() => setIsVisible(true)}>Edit Profile</button>
            {isVisible && (
                <form id='editProfileForm' onSubmit={handleEditProfileSubmit} style={profileFormStyle}>
                    <input
                        type='text'
                        placeholder='Enter display name'
                        name='displayname'
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                    <input
                        type='text'
                        placeholder='Enter new display name'
                        name='newDisplayName'
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        required
                    />
                    <button type='submit'>Submit</button>
                    <button onClick={() => setIsVisible(false)} id='closeButton'>Close</button>
                </form>
            )}
        </div>
    );

};

export default EditProfileForm;