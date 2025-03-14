import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "./LogoutButton";

const ProfilePickerPage = () => {
    const [profileText, setProfileText] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [debug, setDebug] = useState('');
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

    // Helper function to properly extract the token, removing any quotes
    const getCleanToken = () => {
        const rawToken = localStorage.getItem('authToken');
        if (!rawToken) return null;
        
        // Remove any surrounding quotes if present
        return rawToken.replace(/^["'](.*)["']$/, '$1');
    };

    const loadProfiles = () => {
        try {
            const token = getCleanToken();
            if (!token) {
                setError('No authentication token found. Please login again.');
                navigate('/');
                return;
            }

            addDebugInfo(`Clean token from localStorage (first 20 chars): ${token.substring(0, 20)}...`);
            
            try {
                const decoded = jwtDecode(token);
                addDebugInfo(`Decoded token: ${JSON.stringify(decoded)}`);
                
                // Check token expiration
                const exp = decoded.exp;
                const now = Math.floor(Date.now() / 1000);
                addDebugInfo(`Token expires at: ${exp}, current time: ${now}, difference: ${exp - now} seconds`);
                
                if (exp && exp < now) {
                    addDebugInfo('Token is expired!');
                    setError('Your session has expired. Please login again.');
                    navigate('/');
                    return;
                }
                
                const profiles = decoded.profiles || [];
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
            } catch (decodeError) {
                addDebugInfo(`Error decoding token: ${decodeError.message}`);
                setError('Invalid token format. Please login again.');
            }
        } catch (error) {
            addDebugInfo(`General error in loadProfiles: ${error.message}`);
            setError('Error loading profiles. Please login again.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        addDebugInfo('------ Starting profile creation ------');

        try {
            const token = getCleanToken();
            if (!token) {
                setError('No authentication token found. Please login again.');
                return;
            }

            addDebugInfo(`Using clean token (first 20 chars): ${token.substring(0, 20)}...`);
            addDebugInfo(`Creating profile with displayname: ${displayName}`);

            // Using URLSearchParams for consistency with login/registration
            const formData = new URLSearchParams();
            formData.append('displayname', displayName);
            
            // Construct the header WITHOUT extra quotes
            const authHeader = `Bearer ${token}`;
            addDebugInfo(`Full Authorization header: ${authHeader}`);
            
            const response = await fetch('https://minflixbackend-611864661290.us-west2.run.app/addprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': authHeader
                },
                body: formData,
                credentials: 'include'
            });

            addDebugInfo(`Response status: ${response.status} ${response.statusText}`);
            
            // Clone the response so we can log it and still read body
            const responseClone = response.clone();
            const responseText = await responseClone.text();
            addDebugInfo(`Raw response: ${responseText}`);
            
            if (!response.ok) {
                let errorMessage = `Server error: ${response.status} ${response.statusText}`;
                
                try {
                    // Try to parse the response as JSON
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.detail || errorMessage;
                    addDebugInfo(`Parsed error: ${JSON.stringify(errorData)}`);
                } catch (e) {
                    addDebugInfo(`Could not parse error response as JSON: ${e.message}`);
                }
                
                setError(errorMessage);
                
                if (response.status === 401) {
                    addDebugInfo('Authentication error - redirecting to login');
                    setError('Your session has expired. Please login again.');
                    setTimeout(() => navigate('/'), 3000);
                }
                return;
            }

            // Success!
            addDebugInfo('Profile created successfully!');
            try {
                // Try to parse as JSON
                const data = JSON.parse(responseText);
                localStorage.setItem('authToken', data);
                addDebugInfo('Updated token in localStorage');
            } catch (e) {
                // If not JSON, use as is (without adding quotes)
                localStorage.setItem('authToken', responseText);
                addDebugInfo('Saved raw response as token');
            }
            
            setDisplayName(''); // Clear the input
            loadProfiles(); // Reload profiles

        } catch (error) {
            addDebugInfo(`Fetch error: ${error.message}`);
            setError(`Network error: ${error.message}`);
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
                            required
                        />
                        <button type='submit' style={buttonStyle}>Create Profile</button>
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