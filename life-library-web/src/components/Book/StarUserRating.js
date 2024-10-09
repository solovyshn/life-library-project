import React, { useState, useEffect } from 'react';
import { Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StarUserRating = ({bookISBN, bookPage, setBookData}) => {
    const navigate = useNavigate();
    const accesstoken = localStorage.getItem('access_token');
    const userID = localStorage.getItem('userid');
    const [bookRating, setBookRating] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:5000/getRating/${bookISBN}?user_id=${userID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accesstoken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.rating !== undefined) {
                setBookRating(data.rating);
            } else {
                console.error('Error fetching rating:', data.error);
            }
        })
        .catch(error => console.error('Error fetching rating:', error));
    }, [bookISBN, userID, accesstoken]);


    const changeRating = async (rating) => {
        try {
            const response = await fetch('http://localhost:5000/update_rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accesstoken}`
                },
                body: JSON.stringify({
                    ISBN: bookISBN,
                    rating: rating,
                    user_id: userID
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setBookRating(rating);
            navigate(`/book/${bookISBN}`);
        } catch (error) {
            console.error('Error setting rating:', error);
        }
    };

    return (
        <div className='star-wrapper'>
            <Rating
            name="simple-controlled"
            value = {bookRating}
            onChange={(event, newValue) => {
                changeRating(newValue);
            }}
            size="large"
            />
        </div>
    )
}
  
export default StarUserRating;