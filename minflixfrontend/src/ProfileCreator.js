import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCreator = () => {
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!displayName.trim()) {
            setError('Profile name cannot be empty');
            setIsSubmitting(false);
            return;
        }

        // Create profile
        fetch('http://localhost:8000/create-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ displayname: displayName }),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Not authenticated');
                }
                throw new Error('Failed to create profile');
            }
            return response.json();
        })
        .then(data => {
            console.log('Profile created:', data);
            // Redirect to profiles page
            navigate('/profiles');
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message === 'Not authenticated') {
                navigate('/login');
            } else {
                setError('Failed to create profile. Please try again.');
            }
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    const handleCancel = () => {
        navigate('/profiles');
    };

    return (
        <div className="profile-creator-container">
            <h2>Create a New Profile</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="displayName">Profile Name:</label>
                    <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        maxLength="30"
                        required
                    />
                </div>
                
                <div className="avatar-selection">
                    <p>Avatar (Coming Soon)</p>
                    <div className="avatar-placeholder">
                        {displayName ? displayName.charAt(0).toUpperCase() : '?'}
                    </div>
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileCreator;