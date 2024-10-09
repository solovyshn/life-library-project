import React, {useState, useEffect} from "react";
import HeaderLogged from "../headerLogged";
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import Dropdown from "react-dropdown";
import StarAverageRating from "./StarAverageRating";
import StarUserRating from "./StarUserRating";

const BookPage = () => {
    const navigate = useNavigate();
    const [bookData, setBookData] = useState(null)
    const accesstoken = localStorage.getItem('access_token');
    const ISBN = localStorage.getItem('ISBN')
    const [selectedShelf, setSelectedShelf] = useState('');
    const [options, setOptions] = useState(null) 
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const userID = localStorage.getItem('userid');

    const [isOpen, setIsOpen] = useState(false);
        
    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = async (option) => {
        setSelectedShelf(option.label);
        setIsOpen(false);

        try {
            const response = await fetch('http://localhost:5000/addBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accesstoken}`
                },
                body: JSON.stringify({
                    ISBN: ISBN,
                    shelf_name: option.label // Send the selected shelf name
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigate(`/book/${ISBN}`);
        } catch (error) {
            console.error('Error adding book to shelf:', error);
        }
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5000/book/${ISBN}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${accesstoken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBookData(data);
                console.log(data)
            } catch (error) {
              console.error('Error fetching book information:', error);
            }
          };
          fetchBook();

    };
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5000/book/${ISBN}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${accesstoken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBookData(data);
            } catch (error) {
              console.error('Error fetching book information:', error);
            }
          };
          fetchBook();
        }, [ISBN, bookData, accesstoken]);
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/leave_review', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accesstoken}`,
                },
                body: JSON.stringify({
                    ISBN: ISBN,
                    comment: newComment,
                    user_id: userID
                })
              });
              if (!response.ok) {
                throw new Error('Failed to post comment');
              }
              
              console.log(newComment)
              setNewComment('');
              bookData.book_details['reviews']((prevComments) => [...prevComments, newComment])
            } catch (error) {
              console.error('Error posting comment:', error);
            }
    };
        
    return (
        <div>
            <HeaderLogged/>
            <div className='container'>
                <div className="book-infos">
                    { bookData ? (
                    <div className="book-header">
                        <img className="book-cover-big" src={bookData.book_details.image_url} alt={`${bookData.book_details.title} cover`} />
                        <div className="book-information">
                            <div className="title-author-info">
                                <h1>{bookData.book_details.title}</h1>
                                <hr className="separator" />
                                <h2>{bookData.book_details.author}</h2>
                            </div>
                            <div className="average-rating">
                                <StarAverageRating rating={bookData.book_details.average_rating} />
                                <span className='average-rating-value'>{bookData.book_details.average_rating}    </span>
                                <span className='rating-count'>({bookData.book_details.ratings_count} ratings)</span>
                            </div>
                            <div className="book-meta">
                                <div className='book-text-details'>
                                    <div className='info-row'>
                                        <span className='info-type'>Genre</span>
                                        <span className='info-value'>{bookData.book_details.genre}</span>
                                    </div>
                                    <div className='info-row'>
                                        <span className='info-type'>Year</span>
                                        <span className='info-value'>{bookData.book_details.year}</span>
                                    </div>
                                    <div className='info-row'>
                                        <span className='info-type'>ISBN</span>
                                        <span className='info-value'>{bookData.book_details.ISBN}</span>
                                    </div>
                                    <div className='info-row'>
                                        <span className='info-type'>Publisher</span>
                                        <span className='info-value'>{bookData.book_details.publisher}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="choose-shelf">
                            <Dropdown
                                options={bookData.shelves.map(shelf => ({
                                    value: shelf.shelf_id,
                                    label: shelf.shelf_name,
                                  }))}
                                onChange={handleSelect}
                                value={bookData.book_details['shelf_names'][0] || "None"}
                                placeholder="Select an option"
                                className="custom-dropdown"
                                controlClassName="custom-dropdown-control"
                                menuClassName="custom-dropdown-menu"
                                arrowClosed={<span className="custom-dropdown-arrow" />}
                                arrowOpen={<span className="custom-dropdown-arrow open" />}
                                onFocus={handleToggle}
                                onBlur={handleToggle}
                            />
                            {bookData.book_details['shelf_names'].includes('Read') ? (
                                <div className="user-rating">
                                    <StarUserRating bookISBN={bookData.book_details.ISBN} bookPage={true} setBookData={setBookData} />
                                    <p>Rate this book</p>
                                </div>
                            ) : (
                                <div className="user-rating">
                                    <p>You can rate book after reading.</p>
                                </div>
                            )
                        }
                        </div>
                        <p className="book-description">{bookData.book_details.description}</p>
                        <div></div>
                        <div className="reviews-section">
                            <h2 className="title-reviews">Reviews</h2>
                            <hr className="separator" />
                            {bookData.book_details['shelf_names'].includes('Read') ? (
                                <form onSubmit={handleSubmit} className="comment-section">
                                    <textarea className="comment-text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment"
                                    />
                                    <button className="save-comment" type="submit">Submit</button>
                                </form>
                            ) : (
                                <div className="user-rating">
                                    <p>You can leave review after reading.</p>
                                </div>
                            )}
                            <div>
                                {bookData.book_details['reviews'] ? (
                                    bookData.book_details['reviews'].map((comment, index) => (
                                        <div key={index} className="comment" >
                                            <p className="comment-update-date">{comment.date}</p>
                                            <p className="comment-username">{comment.username}</p>
                                            <p className="comment-review">{comment.review}</p>
                                        </div>
                                ))) :(  
                                    <p>No comments</p>
                                )}
                            </div>
                        </div>

                    </div>
                    
                ) : (
                    <p className="empty-shelf">Loading book information...</p>
                )}
                </div>
            </div>
    </div>)
}

export default BookPage;