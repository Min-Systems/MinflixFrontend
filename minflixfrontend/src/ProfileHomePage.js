import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTokenData, isTokenValid } from './Network';
import FilmList from './FilmList';

const ProfileHomePage = () => {
    const navigate = useNavigate();
    const {profileId} = useParams();
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = () => {
        try {
            // Check token validity
            if (!isTokenValid()) {
                setTimeout(() => navigate('/'), 3000);
                return;
            }
            
            // Get token data
            const tokenData = getTokenData(); 

            // Get and set display name
            for (let i = 0; i < tokenData.profiles.length; i++) {
                if (tokenData.profiles[i].id == profileId) {
                    setDisplayName(tokenData.profiles[i].displayname);
                }
            }

        } catch (error) {
            console.log(`Error in loadProfiles: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Profile Home Page</h2>
            <p>Profile for {displayName}</p>
            <button onClick={() => navigate("/profiles")}>Back to profiles</button>
            <FilmList filmList={['echoes_of_tommorow', 'starlight_odyssey', 'under_the_crimson_sun']}/>
        </div>
    );

};

export default ProfileHomePage;