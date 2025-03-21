import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProfile, editProfile, getTokenData, isTokenValid, getAuthToken } from './Network';
import network from './Network';
const { API_BASE_URL } = network;

const FilmList = ({ filmList }) => {

    for (let i = 0; i < filmList.length; i++) {
        console.log(filmList[i]);
        console.log(`${API_BASE_URL}/images/${filmList[i]}`);
    }

    return (
        <div>
            <h2>Film List</h2>
            {filmList.map((filmName, index) => (
                <div key={index} className='filmItem'>
                    <h3>{filmName}</h3>
                    <img
                        src={`${API_BASE_URL}/images/${filmName}`}
                        alt={`Film ${index + 1}`}
                        loading='lazy'
                    />
                </div>
            ))}
        </div>
    );
};

export default FilmList;