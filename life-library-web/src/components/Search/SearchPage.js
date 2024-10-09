import React, {useEffect, useState} from 'react';
import '../styles.css';
import HeaderLogged from "../headerLogged.js"
import BookItemForSearch from "./BookItemForSearch.js"
import sortIcon from "../images/sort_85744.svg"

const SearchPage = () => {
  const [searchResult, setSearchResult] = useState(null);
  const accesstoken = localStorage.getItem('access_token');
  const searchPar = localStorage.getItem('searchPar');
  const [authorSort, setAuthorSort] = useState(null);
  const [titleSort, setTitleSort] = useState(null);
  const [genreSort, setGenreSort] = useState(null);

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
    const sortedBooks = [...searchResult].sort((a, b) => {
      return descending 
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
    });
    setSearchResult(sortedBooks);
  }
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
    const sortedBooks = [...searchResult].sort((a, b) => {
      return descending 
          ? b.author.localeCompare(a.author)
          : a.author.localeCompare(b.author);
    });
    setSearchResult(sortedBooks);
  }
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
    const sortedBooks = [...searchResult].sort((a, b) => {
      return descending 
          ? b.genre.localeCompare(a.genre)
          : a.genre.localeCompare(b.genre);
    });
    setSearchResult(sortedBooks);

  }

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const response = await fetch(`http://localhost:5000/search/${searchPar}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accesstoken}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
          setSearchResult(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching shelves:', error);
        }
      };
      fetchSearch();
    }, [searchPar, accesstoken]);
    const renderBooksForSearch = () => {
      if (!searchResult || searchResult.length === 0) {
        return <p className='empty-shelf'>Unfortunately, there is no book with this ISBN, title or author. Please, try again.</p>;
      }
      return searchResult.map((book, index) => (
        <BookItemForSearch key={index} book={book} />
      ));
    };
    return (
      <div>
        <HeaderLogged/>
          <div className='container'>
            {searchResult ? (
              <div>
                <h1 className='shelves-title'>Result of search by "{searchPar}"</h1>
                <div className="booklist">
                  <div className="booklist-header">
                    <span></span>
                    <span>Title  <img  src={sortIcon} alt='Sort' className='sort-icon' onClick={SortByTitle}/> & Author  <img  src={sortIcon} alt='Sort' className='sort-icon' onClick={SortByAuthor}/></span>
                    <span>Genre <img  src={sortIcon} alt='Sort' className='sort-icon' onClick={SortByGenre}/></span>
                    <span>Users</span>
                    <span></span>
                  </div>
                  <div >
                    {renderBooksForSearch()}
                  </div>
                </div>
              </div>
            ):(
              <p>Loading search information...</p>
            )}
          </div>
        </div>
    )
}

export default SearchPage;