import React from 'react';
import { Rating } from '@mui/material';

const StarAverageRating = ({rating}) => {
    return (
        <div className='star-wrapper'>
            <Rating name="half-rating-read" value={rating} precision={0.5} size="large" readOnly />
        </div>
    )
}
  
export default StarAverageRating;
