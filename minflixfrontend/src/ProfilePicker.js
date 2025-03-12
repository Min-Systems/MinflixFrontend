import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePicker = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user profiles
        fetch('http://localhost:8000/user-profiles', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Not authenticated
                    throw new Error('Not authenticated');
                }
                throw new Error('Failed to fetch profiles');
            }
            return response.json();
        })
        .then(data => {
            setProfiles(data.profiles || []);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message === 'Not authenticated') {
                navigate('/login');
            } else {
                setError('Failed to load profiles. Please try again.');
                setLoading(false);
            }
        });
    }, [navigate]);

    const handleProfileSelect = (profileId) => {
        // Set active profile
        fetch('http://localhost:8000/select-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile_id: profileId }),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to select profile');
            }
            return response.json();
        })
        .then(() => {
            // Navigate to home page
            navigate('/home');
        })
        .catch(error => {
            console.error('Error:', error);
            setError('Failed to select profile. Please try again.');
        });
    };

    const navigateToCreateProfile = () => {
        navigate('/create-profile');
    };

    if (loading) {
        return <div>Loading profiles...</div>;
    }

    return (
        <div className="profile-picker-container">
            <h2>Who's Watching?</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="profiles-grid">
                {profiles.length > 0 ? (
                    profiles.map(profile => (
                        <div 
                            key={profile.id} 
                            className="profile-item"
                            onClick={() => handleProfileSelect(profile.id)}
                        >
                            <div className="profile-avatar">
                                {/* You can replace this with an actual avatar image */}
                                <div className="avatar-placeholder">
                                    {profile.displayname.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="profile-name">{profile.displayname}</div>
                        </div>
                    ))
                ) : (
                    <div className="no-profiles">
                        <p>No profiles found. Create your first profile.</p>
                    </div>
                )}
                
                {/* Add Profile Button */}
                <div className="profile-item add-profile" onClick={navigateToCreateProfile}>
                    <div className="add-profile-icon">+</div>
                    <div className="profile-name">Add Profile</div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePicker;