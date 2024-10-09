import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarUserRating from '../Book/StarUserRating';
import deleteIcon from '../images/trash_bin_icon-icons.com_67981.svg';

function BookItem({ book, activeShelf }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();
  const accesstoken = localStorage.getItem('access_token');
  const userID = localStorage.getItem('userid');

  const goToBookPage = async (bookISBN) => {
    localStorage.setItem('ISBN', bookISBN);
    navigate(`/book/${bookISBN}`);
  };

  const goToElseAccountPage = async (userID) => {
    if (userID !== null) {
      localStorage.setItem('elseUserID', userID);
      navigate(`/otheraccount/${userID}`);
    } else {
      // Handle the case where userID is null, if necessary
      console.log('UserID is null');
    }
  };

  const deleteBook = async () => {
    try {
      const response = await fetch('http://localhost:5000/deleteBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        },
        body: JSON.stringify({
          ISBN: book['ISBN'],
          shelf_name: activeShelf,
          user_id: userID
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Update the state to indicate the book is deleted
      setIsDeleted(true);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // If the book is deleted, do not render the component
  if (isDeleted) {
    return null;
  }

  return (
    <div className="bookitem">
      <div className="book-info">
        <div className="book-shelf-cover">
          <img src={book.image_url} alt={`${book.title} cover`} />
        </div>
        <div className="book-title-author">
          <div className="book-title">{book.title}</div>
          <div className="book-author">{book.author}</div>
        </div>
        <div className="book-genre">{book.genre}</div>
        <div className="book-date">{book.update_date}</div>
        {(activeShelf === 'Lent' || activeShelf === 'Borrowed') && (
          <span onClick={() => goToElseAccountPage(book.second_user_id)} className="book-username">
            {book.second_user_name !== null ? book.second_user_name : 'Not specified'}
          </span>
        )}
        {activeShelf === 'Read' && (
          <div className="rating">
            <StarUserRating bookISBN={book['ISBN']} />
          </div>
        )}

        <div className="book-more-info">
          <span className="book-more-info-text" onClick={() => goToBookPage(book['ISBN'])}>See more info</span>
          <img src={deleteIcon} alt="delete" className="delete-icon" onClick={deleteBook} />
        </div>
      </div>
    </div>
  );
}

export default BookItem;
