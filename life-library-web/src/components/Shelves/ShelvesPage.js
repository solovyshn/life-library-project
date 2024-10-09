import React, { useState, useEffect } from 'react';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import HeaderLogged from "../headerLogged.js"
import BookItem from "./BookItem.js"
import sortIcon from "../images/sort_85744.svg"

function ShelvesPage() {
    const navigate = useNavigate();
    const [shelvesInfo, setShelvesInfo] = useState(null);
    const [activeShelf, setActiveShelf] = useState(null);
    const accesstoken = localStorage.getItem('access_token')
    const userID = localStorage.getItem('userid')
    const [authorSort, setAuthorSort] = useState(null);
    const [titleSort, setTitleSort] = useState(null);
    const [genreSort, setGenreSort] = useState(null);
    const [dateSort, setDateSort] = useState(null);

    const SortByAuthor = () => {
      let descending;
      if (authorSort === null) {
          descending = false;
          setAuthorSort(true);
      } else if (authorSort) {
          descending = true;
          setAuthorSort(false);
      } else {
          descending = false;
          setAuthorSort(true);
      }
      const newData = shelvesInfo.map(shelf => {
          if (shelf.shelf_name === activeShelf) {
              const sortedBooks = [...shelf.books].sort((a, b) => {
                  return descending 
                      ? b.author.localeCompare(a.author)
                      : a.author.localeCompare(b.author);
              });
              return { ...shelf, books: sortedBooks };
          }
          return shelf;
      });
      setShelvesInfo(newData);
    }
    const SortByTitle = () => {
      let descending;
      if (titleSort === null) {
          descending = false;
          setTitleSort(true);
      } else if (titleSort) {
          descending = true;
          setTitleSort(false);
      } else {
          descending = false;
          setTitleSort(true);
      }
      const newData = shelvesInfo.map(shelf => {
          if (shelf.shelf_name === activeShelf) {
              const sortedBooks = [...shelf.books].sort((a, b) => {
                  return descending 
                      ? b.title.localeCompare(a.title)
                      : a.title.localeCompare(b.title);
              });
              return { ...shelf, books: sortedBooks };
          }
          return shelf;
      });
      setShelvesInfo(newData);
  };
  const SortByGenre = () => {
    let descending;
    if (genreSort === null) {
        descending = false;
        setGenreSort(true);
    } else if (genreSort) {
        descending = true;
        setGenreSort(false);
    } else {
        descending = false;
        setGenreSort(true);
    }
    const newData = shelvesInfo.map(shelf => {
        if (shelf.shelf_name === activeShelf) {
            const sortedBooks = [...shelf.books].sort((a, b) => {
                return descending 
                    ? b.genre.localeCompare(a.genre)
                    : a.genre.localeCompare(b.genre);
            });
            return { ...shelf, books: sortedBooks };
        }
        return shelf;
    });
    setShelvesInfo(newData);      
    }
    const SortByDate = () => {
      let descending;
      if (dateSort === null) {
          descending = false;
          setDateSort(true);
      } else if (dateSort) {
          descending = true;
          setDateSort(false);
      } else {
          descending = false;
          setDateSort(true);
      }
      const newData = shelvesInfo.map(shelf => {
          if (shelf.shelf_name === activeShelf) {
              const sortedBooks = [...shelf.books].sort((a, b) => {
                  return descending 
                      ? b.update_date.localeCompare(a.update_date)
                      : a.update_date.localeCompare(b.update_date);
              });
              return { ...shelf, books: sortedBooks };
          }
          return shelf;
      });
      setShelvesInfo(newData);
    }

    useEffect(() => {
      const fetchShelves = async () => {
        try {
          const response = await fetch(`http://localhost:5000/shelves/${userID}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accesstoken}`
            }
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          setShelvesInfo(data);
          const activeShelfName = localStorage.getItem('selectedShelf');
          if(activeShelfName){
              setActiveShelf(activeShelfName);
          }
          else if (data.length > 0) {
            setActiveShelf(data[0].shelf_name); 
          }
          console.log(data);
        } catch (error) {
          console.error('Error fetching shelves:', error);
        }
      };
        fetchShelves();
      }, [userID, accesstoken]);

      const handleShelfClick = (shelfName) => {
        setActiveShelf(shelfName);
      };


      const renderBooksForActiveShelf = (activeShelfData) => {
        // const activeShelfData = shelvesInfo.find(shelf => shelf.shelf_name === activeShelf);
        if (!activeShelfData) return null;
        if (!activeShelfData.books || activeShelfData.books.length === 0) {
            return <p className='empty-shelf'>Unfortunately, this shelf is empty. Try searching for new books to add them in here.</p>;
          }
        
        return activeShelfData.books.map((book, index) => (
            <BookItem key={index} book={book} activeShelf={activeShelf}/>
        ));
      };
    
        return (
        <div>
            <HeaderLogged />
            <div className='container'>
            {shelvesInfo ? (
            <div>
                <h1 className='shelves-title'>Your Book Shelves</h1>
                <nav className="navigation">
                    {shelvesInfo.map((shelf, index) => (
                        <button
                            key={index}
                            className={activeShelf === shelf.shelf_name ? 'active' : ''}
                            onClick={() => handleShelfClick(shelf.shelf_name)}
                        >
                            {shelf.shelf_name}
                        </button>
                    ))}
                    <button className='add-shelf'>Add</button>
                </nav>
                <div className="booklist">
                    <div className="booklist-header">
                        <span></span>
                        <span>Title  <img  src={sortIcon} alt='Sort' className='sort-icon' onClick={SortByTitle}/> & Author  <img  src={sortIcon} alt='Sort' className='sort-icon' onClick={SortByAuthor}/></span>
                        <span>Genre  <img  src={sortIcon} alt='Sort' className='sort-icon' onClick={SortByGenre}/></span>
                        <span>Added date  <img  src={sortIcon} alt='Sort' className='sort-icon' onClick={SortByDate}/></span>
                        {(activeShelf === 'Lent' || activeShelf === 'Borrowed') && <span>Name of another user</span>}
                        {(activeShelf === 'Read') && <span>Rating </span> }
                        <span></span>
                    </div>
                    <div>
                      {renderBooksForActiveShelf(shelvesInfo.find(shelf => shelf.shelf_name === activeShelf))}
                    </div>
                </div>
            </div>
            ):(
                <p className='empty-shelf'>Loading shelves information...</p>
            )}
            </div>
        </div>
    );
}

export default ShelvesPage;