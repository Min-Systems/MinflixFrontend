import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { addProfile, editProfile, getTokenData, isTokenValid } from './Network';

const ProfilePickerPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [displayName, setDisplayName] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [showAddProfileForm, setShowAddProfileForm] = useState(false);
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


    const loadProfiles = () => {
        try {
            // Check token validity
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Get token data
            const tokenData = getTokenData();

            // Set the profile data
            setProfiles(tokenData.profiles);
            // Close the form

        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }
    };

    useEffect(() => {
        loadProfiles();
    }, []);

    const handleAddProfileSubmit = async (event) => {
        event.preventDefault();

        try {
            // Check token validity before attempting request
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            // Use the API function from network.js
            const newToken = await addProfile(displayName);

            // Success!
            localStorage.setItem('authToken', newToken);

            setDisplayName('');
            loadProfiles();
            setShowAddProfileForm(false);
        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }

    };

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
            loadProfiles();
            setShowEditProfileForm(false);
        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }

    };

    const handleProfileSelect = (profileId) => {
       navigate(`/profile/${profileId}`);
    };

    return (
        <div id='overlay'>
            <h2>Profile Dashboard</h2>

            <div id='profileListContainer'>
                {profiles.length === 0 ? (
                    <p>No profiles yet. Click 'Add Profile' to create one.</p>
                ) : (
                    <ul id='profileList'>
                        {profiles.map(profile => (
                            <li key={profile.id} id='profileListItem'>
                                <button
                                    id='profileButton'
                                    onClick={() => handleProfileSelect(profile.id)}
                                >
                                    {profile.displayname}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button onClick={() => setShowEditProfileForm(true)}>Edit Profile</button>
            <div id='editProfileFormContainer'>
                {showEditProfileForm && (
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
                        <button onClick={() => setShowEditProfileForm(false)} id='closeButton'>Close</button>
                    </form>
                )}
            </div>

            <button id='showAddProfileButton' onClick={() => setShowAddProfileForm(true)}>Add Profile</button>
            <div id='addProfileFormContainer'>
                {showAddProfileForm && (
                    <form id='addProfileForm' onSubmit={handleAddProfileSubmit} style={profileFormStyle}>
                        <input
                            type='text'
                            placeholder='Enter display name'
                            name='displayname'
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                        <button type='submit'>Submit</button>
                        <button onClick={() => setShowAddProfileForm(false)} id='closeButton'>Close</button>
                    </form>
                )}
            </div>
            <LogoutButton />
        </div>
    );
};

export default ProfilePickerPage;