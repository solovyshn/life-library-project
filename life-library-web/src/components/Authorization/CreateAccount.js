import React, { useState, useEffect  } from 'react';
import '../styles.css'; 
import axios from 'axios';
import Header from './header.js';
import { Link } from "react-router-dom";

const CreateAccount = () => {
  const [yourName, setName] = useState('');
  const [yourPassword, setYourPassword] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [repassword, setRepassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [region, setRegion] = useState('');
  const [accountType, setAccountType] = useState('');
  const [errors, setErrors] = useState({});
  const [isPublic, setIsPublic] = useState(false);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/regions')
      .then(response => response.json())
      .then(data => setRegions(data))
      .catch(error => console.error('Error fetching regions:', error));
  }, []);


  const handleCheckboxChange = () => {
      setIsPublic(!isPublic);
  };

  const handleInputChange = (e) => {
      switch (e.target.id) {
          case 'yourName':
              setName(e.target.value);
              break;
          case 'yourPassword':
              setYourPassword(e.target.value);
              break;
          case 'yourEmail':
              setYourEmail(e.target.value);
              break;
          case 'repassword':
              setRepassword(e.target.value);
              break;
          case 'birthday':
              setBirthday(e.target.value);
              break;
          case 'region':
              setRegion(e.target.value);
              break;
          case 'accountType':
              setAccountType(e.target.value);
              break;
          default:
              break;
      }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!yourName || !yourName.match(/^[\w-]+\s[\w-]+$/)) {
      newErrors.yourName = 'Your name must contain two words separated by a space, and only letters and dashes are allowed.';
      console.log(newErrors.yourName)
    }
    if (!yourEmail || !yourEmail.includes('@') || !yourEmail.includes('.')) {
      newErrors.yourEmail = 'Please enter a valid email address.';
    }

    if (!repassword || repassword !== yourPassword) {
      newErrors.repassword = 'Passwords do not match.';
    }

    if (!birthday) {
      newErrors.birthday = 'Please enter your birthday.';
    }

    if (!region) {
      newErrors.region = 'Please enter your region.';
    }

    // Password validation: at least 1 number, 1 symbol, 1 uppercase, 1 lowercase, and minimum length
    if (!yourPassword || !yourPassword.match(/^(?=.*\d)(?=.*[!@#$%^&_*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/)) {
      newErrors.password = 'Password must contain at least 1 number, 1 symbol, 1 uppercase letter, 1 lowercase letter, and be at least 8 characters long.';
    }
    setErrors(newErrors);  
    if(Object.keys(errors).length > 0){
      return;
    }
    let LibraryType = true
    if(accountType==="Owner"){
      LibraryType = false
    }
    if(isPublic === true){
      console.log("yes")
    }
    const formData = {
      yourName,
      yourPassword,
      yourEmail,
      birthday,
      region,
      LibraryType,
      isPublic
    };
    console.log(formData);
    try {
        const response = await axios.post('http://localhost:5000/register', formData);
        console.log(response.data); 
    } catch (error) {
        console.error('Error:', error);
    }
  };

  return (
    <div>
      <Header/>
      <div className="container">
        <form className="create-account-box" onSubmit={handleSubmit}>
          <h2 className="create-account-title">Create account</h2>
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="yourName" className="field-label">Your name</label>
              <input type="text" id="yourName" className="form-control" value={yourName} onChange={handleInputChange} placeholder="Enter your name" />
              {errors.yourName && <p className="error-message">{errors.yourName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="yourPassword" className="field-label">Password</label>
              <input type="password" id="yourPassword" className="form-control" value={yourPassword} onChange={handleInputChange} placeholder="Enter at least 6 characters" />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="yourEmail" className="field-label">Email</label>
              <input type="text" id="yourEmail" className="form-control" value={yourEmail} onChange={handleInputChange} placeholder="Enter your email" />
              {errors.yourEmail && <p className="error-message">{errors.yourEmail}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="repassword" className="field-label">Re-enter password</label>
              <input type="password" id="repassword" className="form-control" value={repassword} onChange={handleInputChange} placeholder="Re-enter your password" />
              {errors.repassword && <p className="error-message">{errors.repassword}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="birthday" className="field-label">Birthday</label>
              <input type="date" id="birthday" className="form-control" value={birthday} onChange={handleInputChange} placeholder="Enter your birthday" />
              {errors.birthday && <p className="error-message">{errors.birthday}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="region" className="field-label">Region</label>
              <select id="region" className="form-control" value={region} onChange={handleInputChange}>
                  <option value="">Select region</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
              </select>
              {errors.region && <p className="error-message">{errors.region}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="accountType" className="field-label">Type of account</label>
              <select id="accountType" className="form-control" value={accountType} onChange={handleInputChange}>
                <option key="Owner" value="Owner">Owner</option>
                <option key="Library" value="Library">Library</option>
              </select>
              {errors.accountType && <p className="error-message">{errors.accountType}</p>}
            </div>
            <div>
              <label className="checkbox-label">
                <input type="checkbox" checked={isPublic} onChange={handleCheckboxChange} />
                I agree to make my account public and be able to see the libraries of other users.              </label>
            </div>

          </div>
            <button type="submit" className="create-submit-button">
              Sign up
            </button>
            <div className="sign-in-link">
              <hr className="separator" />
              <span className="separator-text">Already have an account? <Link to="/login" className="sign-in-text">Sign in</Link></span>
              <hr className="separator" />
            </div>
        </form>
          <div className="copyright-text">
            ©AlAskA Corporation
          </div>
      </div>  
    </div>
  );
};

export default CreateAccount;