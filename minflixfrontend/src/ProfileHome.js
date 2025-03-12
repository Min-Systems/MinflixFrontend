import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileHome = () => {
    const [films, setFilms] = useState([]);
    const [activeProfile, setActiveProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get current profile information
        fetch('http://localhost:8000/current-profile', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Not authenticated');
                }
                throw new Error('Failed to fetch profile');
            }
            return response.json();
        })
        .then(data => {
            setActiveProfile(data.profile);
            
            // Now fetch films
            return fetch('http://localhost:8000/films', {
                method: 'GET',
                credentials: 'include'
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch films');
            }
            return response.json();
        })
        .then(filmsData => {
            setFilms(filmsData);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message === 'Not authenticated') {
                navigate('/login');
            } else {
                setError('Failed to load content. Please try again.');
                setLoading(false);
            }
        });
    }, [navigate]);

    const handleLogout = () => {
        fetch('http://localhost:8000/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(() => {
            navigate('/login');
        })
        .catch(error => {
            console.error('Logout error:', error);
            navigate('/login');
        });
    };

    const handleSwitchProfile = () => {
        navigate('/profiles');
    };

    if (loading) {
        return <div className="loading">Loading content...</div>;
    }

    return (
        <div className="profile-home-container">
            <header className="home-header">
                <h1>Minflix</h1>
                {activeProfile && (
                    <div className="profile-info">
                        <span>{activeProfile.displayname}</span>
                        <button onClick={handleSwitchProfile}>Switch</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </header>

            {error && <div className="error-message">{error}</div>}

            <main className="films-container">
                <h2>Available Films</h2>
                
                {films.length > 0 ? (
                    <div className="films-grid">
                        {films.map(film => (
                            <div key={film.id} className="film-card">
                                <div className="film-thumbnail">
                                    {/* Placeholder for film thumbnail */}
                                    <div className="thumbnail-placeholder">
                                        <span>{film.title.charAt(0)}</span>
                                    </div>
                                </div>
                                <div className="film-info">
                                    <h3>{film.title}</h3>
                                    <p>Producer: {film.producer}</p>
                                    <p>Length: {film.length} mins</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-films">
                        <p>No films available at the moment.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfileHome;