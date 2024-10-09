import React, {useState} from 'react';
import './styles.css';
import searchIcon from "./images/magnifier_icon-icons.com_67993.svg"
import shelvesIcon from "./images/bookshelf_icon_155732.svg"
import avatarIcon from "./images/account_avatar_face_man_people_profile_user_icon_123197.svg"
import logOutIcon from "./images/log_out_icon_128821.svg"
import { useNavigate } from 'react-router-dom';

const HeaderLogged = () => {
    const navigate = useNavigate();
    const [searchPar, setSearchPar] = useState('');

    const handleInputChange = (e) => {
        setSearchPar(e.target.value);
    }  

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (response.ok) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('userid');
                navigate(`/login`)
            } else {
                console.error('Error logging out');
            }
        } catch (error) {
            console.error('Error:', error);
        }    
    };

    const search = async () => {
        if(searchPar.length > 0){
            localStorage.setItem('searchPar', searchPar);
            navigate(`/search/${searchPar}`);
        }
    }    

    const goToAccountPage = async () => {
        let userID = localStorage.getItem('userid');
        navigate(`/account/${userID}`);
    }    

    const goToShelvesPage = async () => {
        let userID = localStorage.getItem('userid');
        localStorage.setItem('selectedShelf', 'Read');
        navigate(`/shelves/${userID}`);
    }    


    return (
        <header className="signup-header">
            <div className="header-left">
                <h1 className="header-title">
                    <span className="light-font">Life's</span> <span className="semibold-font">Library</span>
                </h1>
                <div className="search-container">
                    <input type="text" placeholder="Search for a book title, author..." className="search-input" onChange={handleInputChange}/>
                    <img src={searchIcon} alt='Search' className='search-icon' onClick={search}></img>
                </div>
            </div>
            <div className="header-right">
                <div className='header-button' onClick={goToShelvesPage}>
                    <img src={shelvesIcon} alt='Shelves' className='shelves-icon'></img>
                    <h2 className='button-title'>Shelves</h2>
                </div>
                <div className="header-button">
                    <img src={avatarIcon} alt='Profile Avatar' className="profile-picture" onClick={goToAccountPage} />
                </div>
                <div className='header-button' onClick={handleLogout}>
                    <img src={logOutIcon} alt='Log out' className='log-out-icon'></img>
                    <h2 className='button-title'>Log out</h2>
                </div>
            </div>
        </header>
    );
};

export default HeaderLogged;
