import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "./LogoutButton";

const ProfilePickerPage = () => {
    const [profileText, setProfileText] = useState('');
    const [displayName, setDisplayName] = useState('');
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
        const token = localStorage.getItem('authToken');
        const decoded = jwtDecode(token);
        const profiles = decoded.profiles || [];

        if (profiles.length == 0) {
            setProfileText('No profiles');
        }
        else {
            var the_text = "";
            for (var i = 0; i < profiles.length; i++) {
                the_text += profiles[i].displayname + '\n';
            }
            setProfileText(the_text);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const token = localStorage.getItem('authToken');
        console.log("the token");
        console.log(token);
        const the_header = 'Bearer ' + token
        try {
            const requestOptions = {
                method: 'Post',
                body: formData,
                headers: {
                    'Authorization': the_header
                },
                credentials: 'include'
            };
            const response = await fetch('https://minflixbackend-611864661290.us-west2.run.app/addprofile', requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Problem: ' + JSON.stringify(errorData));
            }

            const data = await response.json();
            console.log("Response data:", data);

            localStorage.setItem('authToken', data);

            const token = localStorage.getItem('authToken');
            const decoded = jwtDecode(token);
            const profiles = decoded.profiles || [];

            if (profiles.length == 0) {
                setProfileText('No profiles');
            }
            else {
                var the_text = "";
                for (var i = 0; i < profiles.length; i++) {
                    the_text += profiles[i].displayname + '\n';
                }
                setProfileText(the_text);
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div id='page'>
            <h1>
                Profile Dashboard
            </h1>
            <h2>See Profiles</h2>
            <textarea id='TextArea' value={profileText} readOnly />
            <div id='form' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <form id='profileForm' onSubmit={handleSubmit}>
                        <label htmlFor='displayname'></label>
                        <input
                            type='text'
                            placeholder='enter display name'
                            name='displayname'
                            value={displayName}
                            style={{ width: '300px', height: '40px', padding: '10px', borderRadius: '5px' }}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                        <button type='submit' style={buttonStyle}>Create Profile</button>
                    </form>
                </div>
            </div>
            <LogoutButton />
        </div>
    );
};

export default ProfilePickerPage;