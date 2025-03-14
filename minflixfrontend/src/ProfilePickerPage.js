import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ProfileList subcomponent
const ProfileList = ({ profiles, onSelectProfile }) => {
    return (
        <div className="profile-list">
            <h2>Select a Profile</h2>
            <div className="profiles-container">
                {profiles.length === 0 ? (
                    <p>No profiles found. Create a new profile to get started.</p>
                ) : (
                    profiles.map(profile => (
                        <div 
                            key={profile.id} 
                            className="profile-item"
                            onClick={() => onSelectProfile(profile)}
                        >
                            <div className="profile-avatar">
                                <div className="avatar-circle">
                                    {profile.displayname.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="profile-name">{profile.displayname}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const ProfilePickerPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Get the token from localStorage and decode it
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Redirect to login if no token
            navigate('/');
            return;
        }

        try {
            // Decode the token to get profile information
            const decoded = jwtDecode(token);
            setProfiles(decoded.profiles || []);
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/');
        }
    }, [navigate]);

    const openForm = () => {
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setDisplayName('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('displayname', displayName);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8000/addprofile', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Failed to create profile with status: ${response.status}`);
            }

            // Get the new token from the response
            const newToken = await response.text();
            
            // Update the token in localStorage
            localStorage.setItem('authToken', newToken);
            
            // Decode the new token to get updated profiles
            const decoded = jwtDecode(newToken);
            setProfiles(decoded.profiles || []);
            
            // Close the form
            closeForm();

        } catch (error) {
            console.error('Profile creation error:', error);
            alert(`Failed to create profile: ${error.message}`);
        }
    };

    const handleSelectProfile = (profile) => {
        // Store selected profile in localStorage for future use
        localStorage.setItem('selectedProfile', JSON.stringify(profile));
        console.log(`Selected profile: ${profile.displayname}`);
        // You can add navigation or other actions here in the future
    };

    return (
        <div className="profile-dashboard">
            <h1>Profile Dashboard</h1>

            {/* Profile list component */}
            <ProfileList profiles={profiles} onSelectProfile={handleSelectProfile} />

            {/* Button to open form */}
            <button className="open-button" onClick={openForm}>Create New Profile</button>

            {/* Profile Form Popup */}
            <div className="form-popup" id="profileForm" style={{ display: showForm ? 'block' : 'none' }}>
                <form onSubmit={handleSubmit} className="form-container">
                    <h1>Create New Profile</h1>
                    
                    <label htmlFor="displayname"><b>Display Name</b></label>
                    <input 
                        type="text" 
                        placeholder="Enter Display Name" 
                        name="displayname" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required 
                    />

                    <button type="submit" className="btn">Create</button>
                    <button type="button" className="btn cancel" onClick={closeForm}>Close</button>
                </form>
            </div>

            {/* CSS Styles */}
            <style>
                {`
                .profile-dashboard {
                    font-family: Arial, Helvetica, sans-serif;
                    padding: 20px;
                }

                .open-button {
                    background-color: #555;
                    color: white;
                    padding: 16px 20px;
                    border: none;
                    cursor: pointer;
                    opacity: 0.8;
                    margin-top: 20px;
                }

                .form-popup {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border: 3px solid #f1f1f1;
                    z-index: 9;
                }

                .form-container {
                    max-width: 300px;
                    padding: 10px;
                    background-color: white;
                }

                .form-container input[type=text] {
                    width: 90%;
                    padding: 15px;
                    margin: 5px 0 22px 0;
                    border: none;
                    background: #f1f1f1;
                }

                .form-container input[type=text]:focus {
                    background-color: #ddd;
                    outline: none;
                }

                .form-container .btn {
                    background-color: #04AA6D;
                    color: white;
                    padding: 16px 20px;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    margin-bottom: 10px;
                    opacity: 0.8;
                }

                .form-container .cancel {
                    background-color: red;
                }

                .form-container .btn:hover, .open-button:hover {
                    opacity: 1;
                }

                /* Profile List Styles */
                .profile-list {
                    margin-top: 20px;
                }

                .profiles-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-top: 15px;
                }

                .profile-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    width: 120px;
                }

                .profile-item:hover {
                    transform: scale(1.05);
                }

                .profile-avatar {
                    margin-bottom: 10px;
                }

                .avatar-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background-color: #3498db;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    font-weight: bold;
                }

                .profile-name {
                    text-align: center;
                    font-weight: bold;
                }
                `}
            </style>
        </div>
    );
};

export default ProfilePickerPage;