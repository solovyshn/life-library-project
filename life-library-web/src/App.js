import './App.css';
import CreateAccount from "./components/Authorization/CreateAccount.js";
import LogIn from "./components/Authorization/LogIn.js";
import AccountPage from "./components/Accounts/AccountPage.js"
import ElseAccountPage from './components/Accounts/ElseAccountPage.js';
import SearchPage from './components/Search/SearchPage.js';
import ShelvesPage from './components/Shelves/ShelvesPage.js';
import BookPage from './components/Book/BookPage.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/account/:userid" element={<AccountPage />} />
          <Route path="/search/:searchPar" element={<SearchPage />} />
          <Route path="/shelves/:userid" element={<ShelvesPage />} />
          <Route path="/book/:ISBN" element={<BookPage />} />
          <Route path="/otheraccount/:userid" element={<ElseAccountPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
