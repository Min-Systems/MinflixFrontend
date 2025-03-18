import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { addProfile, getTokenData, isTokenValid } from './Network';

const ProfilePickerPage = () => {
    const [profileText, setProfileText] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [debug, setDebug] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const buttonStyle = {
        width: '100px',
        height: '100px',
        backgroundColor: 'gray',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    };

    useEffect(() => {
        loadProfiles();
    }, []);

    const addDebugInfo = (message) => {
        setDebug(prev => prev + "\n" + message);
        console.log("DEBUG:", message);
    };

    const loadProfiles = () => {
        try {
            addDebugInfo('------ Loading profiles ------');
            
            // Check token validity
            if (!isTokenValid()) {
                addDebugInfo('Token is invalid or expired!');
                setError('Your session has expired. Please login again.');
                setTimeout(() => navigate('/'), 3000);
                return;
            }
            
            // Get token data
            const tokenData = getTokenData();
            addDebugInfo(`Decoded token: ${JSON.stringify(tokenData)}`);
            
            const profiles = tokenData?.profiles || [];
            addDebugInfo(`Found ${profiles.length} profiles`);

            if (profiles.length === 0) {
                setProfileText('No profiles');
            } else {
                let profilesList = "";
                for (let i = 0; i < profiles.length; i++) {
                    profilesList += profiles[i].displayname + '\n';
                }
                setProfileText(profilesList);
            }
        } catch (error) {
            addDebugInfo(`Error in loadProfiles: ${error.message}`);
            setError('Error loading profiles. Please login again.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);
        addDebugInfo('------ Starting profile creation ------');

        try {
            // Check token validity before attempting request
            if (!isTokenValid()) {
                addDebugInfo('Token is invalid or expired!');
                setError('Your session has expired. Please login again.');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            addDebugInfo(`Creating profile with displayname: ${displayName}`);
            
            // Use the API function from network.js
            const newToken = await addProfile(displayName);
            
            // Success!
            addDebugInfo('Profile created successfully!');
            localStorage.setItem('authToken', newToken);
            addDebugInfo('Updated token in localStorage');
            
            setDisplayName(''); // Clear the input
            loadProfiles(); // Reload profiles

        } catch (error) {
            addDebugInfo(`Error creating profile: ${error.message}`);
            setError(`Error: ${error.message}`);
            
            // If it's an auth error, redirect to login
            if (error.message.includes('Authentication') || error.message.includes('401')) {
                addDebugInfo('Authentication error - redirecting to login');
                setError('Your session has expired. Please login again.');
                setTimeout(() => navigate('/'), 3000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id='page'>
            <h1>Profile Dashboard</h1>
            <h2>See Profiles</h2>
            <textarea id='TextArea' value={profileText} readOnly style={{ width: '100%', height: '100px' }} />
            
            {error && <div style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '5px' }}>{error}</div>}
            
            <div id='form' style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <form id='profileForm' onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <input
                            type='text'
                            placeholder='Enter display name'
                            name='displayname'
                            value={displayName}
                            style={{ width: '300px', height: '40px', padding: '10px', borderRadius: '5px', marginRight: '10px' }}
                            onChange={(e) => setDisplayName(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <button 
                            type='submit' 
                            style={{
                                ...buttonStyle,
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Profile'}
                        </button>
                    </form>
                </div>
            </div>
            
            <h3>Debug Information</h3>
            <textarea 
                value={debug} 
                readOnly 
                style={{ width: '100%', height: '200px', fontFamily: 'monospace', fontSize: '12px', marginTop: '20px' }}
            />
            
            <LogoutButton />
        </div>
    );
};

export default ProfilePickerPage;