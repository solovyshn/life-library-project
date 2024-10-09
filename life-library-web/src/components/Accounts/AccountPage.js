import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 
import HeaderLogged from "../headerLogged.js"
import accountPhoto from "../images/account_avatar_face_man_people_profile_user_icon_123197.svg"
import arrowRight from "../images/1904671-arrow-arrow-right-change-direction-next-page-right_122521.svg"
import arrowLeft from "../images/1904658-arrow-arrow-left-change-direction-left-next-undo_122508.svg"

const AccountPage = () =>{
    const navigate = useNavigate();
    const [accountInfo, setaccountInfo] = useState(null);
    const accesstoken = localStorage.getItem('access_token')
    const userID = localStorage.getItem('userid')
    const [startIndex, setStartIndex] = useState(0); // Index of the first item to display in the current slide
    const [startRecIndex, setStartRecIndex] = useState(0); // Index of the first item to display in the current slide
    const [startCurIndex, setStartCurIndex] = useState(0); // Index of the first item to display in the current slide
    const itemsPerPage = 4; // Number of items to display per slide
    const itemsCurPerPage = 3; // Number of items to display per slide
  
    useEffect(() => {
            fetch(`http://localhost:5000/accountInfo/${userID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accesstoken}`
                }
            })
            .then(response => response.json())
            .then(data => setaccountInfo(data))
            .catch(error => console.error('Error fetching users:', error));
      }, [userID, accesstoken]);

    const handleClick = (e) => {
        console.log(accountInfo['shelves']);
    }
    const handleNextSlide = () => {
        const nextIndex = startIndex + itemsPerPage;
        if (nextIndex < accountInfo['shelves'].length) {
          setStartIndex(nextIndex);
        }
      };
    
      // Function to handle moving to the previous slide
      const handlePrevSlide = () => {
        const prevIndex = startIndex - itemsPerPage;
        if (prevIndex >= 0) {
          setStartIndex(prevIndex);
        }
      };
    const handleNextRecSlide = () => {
        const nextRecIndex = startRecIndex + itemsPerPage;
        if (nextRecIndex < accountInfo['recommendations'].length) {
          setStartRecIndex(nextRecIndex);
        }
      };
    
      // Function to handle moving to the previous slide
    const handlePrevRecSlide = () => {
        const prevRecIndex = startRecIndex - itemsPerPage;
        if (prevRecIndex >= 0) {
          setStartRecIndex(prevRecIndex);
        }
      };
      const handleNextCurSlide = () => {
          const nextCurIndex = startCurIndex + itemsCurPerPage;
          if (nextCurIndex < accountInfo['recommendations'].length) {
            setStartCurIndex(nextCurIndex);
          }
        };
      
        // Function to handle moving to the previous slide
      const handlePrevCurSlide = () => {
          const prevCurIndex = startCurIndex - itemsCurPerPage;
          if (prevCurIndex >= 0) {
            setStartCurIndex(prevCurIndex);
          }
        };
    const goToShelvesPage = async (shelfName) => {
        localStorage.setItem('selectedShelf', shelfName);
        let userID = localStorage.getItem('userid');
        navigate(`/shelves/${userID}`);
    }    
    const goToBookPage = async (bookISBN) => {
        localStorage.setItem('ISBN', bookISBN)
        navigate(`/book/${bookISBN}`);
    }    

    return(
        <div>
            <HeaderLogged/>
            {accountInfo ? (
            <div className='container'>
            <div className='account-info'>
                    <div className='nameage-info'>
                        <h1>{accountInfo['user_info']['userName']}, {accountInfo['user_info']['age']}</h1>
                        <hr className="separator" />
                    </div>
                    <div className='account-details'>
                        <div className='account-photo'>
                            <img src={accountPhoto} alt="hello" className='accountPhoto'/>
                        </div>
                        <div className='text-details'>
                            <div className='info-row'>
                                <span className='info-type'>Region</span>
                                <span className='info-value'>{accountInfo['user_info']['region']}</span>
                            </div>
                            <div className='info-row'>
                                <span className='info-type'>Birthday</span>
                                <span className='info-value'>{accountInfo['user_info']['birthday']}</span>
                            </div>
                            <div className='info-row'>
                                <span className='info-type'>Email</span>
                                <span className='info-value'>{accountInfo['user_info']['email']}</span>
                            </div>
                        <div className='account-buttons'>
                            <button className='edit-button' onClick={handleClick}>Edit Info</button>
                            <button className='edit-button'>Change password</button>
                            <button className='delete-button'>Delete account</button>
                        </div>
                    </div>
                </div>
            </div>
                <div className='book-collection'>
                    <div className='book-collection-title'>
                        <h1>Currently reading</h1>
                        <hr className="separator" />
                    </div>
                    <div className='currently-reading-container'>    
                        {startCurIndex > 0 && <img src={arrowLeft} alt='next' className='arrow-button' onClick={handlePrevCurSlide}/>}
                        {accountInfo['currentlyReading'].slice(startCurIndex, startCurIndex + itemsCurPerPage).map((item, index) => (
                        <div key={index} className='book-container' onClick={() => goToBookPage(item['ISBN'])}>
                            <img className='book-cover' src={item['image_url']} alt='book cover'/>
                                <div className='book-details'>
                                    <p className='title'>{item['book_title']}</p>
                                    <p className='author'>{item['book_author']}</p>
                                    <p className='started-date'><span className='started'>Started:</span><span className='date'>{item['update_date']}</span></p>
                                </div>
                        </div>
                        ))}
                        {startCurIndex + itemsCurPerPage < accountInfo['currentlyReading'].length && <img src={arrowRight} alt='previous' className='arrow-button' onClick={handleNextCurSlide}/>}
                    </div> 
                </div>
                {accountInfo['recommendations'] ? (
                    <div className='book-collection'>
                        <div className='book-collection-title'>
                            <h1>Based on your likes, we think you should try these books</h1>
                            <hr className="separator" />
                        </div>
                        <div className='recommendations-container'>
                        {startRecIndex > 0 && <img src={arrowLeft} alt='next' className='arrow-button' onClick={handlePrevRecSlide}/>}
                        {accountInfo['recommendations'].slice(startRecIndex, startRecIndex + itemsPerPage).map((item, index) => (
                            <div key={index} className='book-recommendation-container' onClick={() => goToBookPage(item['ISBN'])}>
                                <img className='book-recommendation-cover' src={item['Image_URL_M']} alt={`${item['Book_Title']} cover`} />
                                <p className='book-name'>{item['Book_Title']}</p>
                            </div>
                            ))}
                        {startRecIndex + itemsPerPage < accountInfo['recommendations'].length && <img src={arrowRight} alt='previous' className='arrow-button' onClick={handleNextRecSlide}/>}
                        </div>
                    </div>
                ):(
                    <div className='book-collection'>
                        <div className='book-collection-title'>
                            <h1>Based on your likes, we think you should try these books</h1>
                            <hr className="separator" />
                        </div>
                        <p className='empty-shelf'>Rate at least ten books to get recommendations.</p>
                    </div>
                )}
                <div className='book-collection'>
                    <div className='book-collection-title'>
                        <h1>Your Bookshelves</h1>
                        <hr className="separator" />
                    </div>
                    <div className='shelves-container'>
                    {startIndex > 0 && <img src={arrowLeft} alt='next' className='arrow-button' onClick={handlePrevSlide}/>}
                        {accountInfo['shelves'].slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                            <div key={index} className='shelf-container' onClick={() => goToShelvesPage(item[0])}>
                                <img className='book-cover' src={item[1]} alt={`${item[0]} cover`} />
                                <p className='shelf-name'>{item[0]}</p>
                            </div>
                            ))}
                    {startIndex + itemsPerPage < accountInfo['shelves'].length && <img src={arrowRight} alt='previous' className='arrow-button' onClick={handleNextSlide}/>}
                    </div>
                </div>
                </div>
            ): (
                <div className='container'>
                    <p className='empty-shelf'>Loading account information...</p>
                </div>
            )}

        </div>
    );
}

export default AccountPage;