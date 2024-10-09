import React, { useState } from 'react';
import '../styles.css'; 
import axios from 'axios';
import Header from './header.js';
import {useNavigate} from 'react-router-dom';

const LogIn = () => {
  const navigate = useNavigate();
  const [yourPassword, setYourPassword] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
      switch (e.target.id) {
          case 'yourPassword':
              setYourPassword(e.target.value);
              break;
          case 'yourEmail':
              setYourEmail(e.target.value);
              break;
          default:
              break;
      }
  };

  const handleRedirectToSignup = (e) => {
    navigate('/signup');
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!yourEmail ) {
      newErrors.yourEmail = 'Please enter email address.';
      setErrors(newErrors);  
      return;
    }
    if (!yourPassword ) {
      newErrors.password = 'Please enter password';
      setErrors(newErrors);  
        return;
    }
    if(Object.keys(errors).length > 0){
      return;
    }
    const formData = {
      yourPassword,
      yourEmail
    };
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        const newErrors = {};
        if (!response.ok) {
            if (response.status === 404) {
                newErrors.yourEmail = 'User with this email doesn\'t exist';
                setErrors(newErrors);
                console.log(data);
                return;
            } else if (response.status === 401) {
                newErrors.password = 'Incorrect password';
                setErrors(newErrors);
                console.log(data);
                return;
            } 
            else if (response.status === 400) {
                newErrors.yourEmail = 'Type in information';
                setErrors(newErrors);
                console.log(data);
                return;
            }
            else {
                newErrors.yourEmail('Error occurred');
                return;
            }
        }   
        let accesstoken = data['access_token'];
        let userID = data['id'];
        localStorage.setItem('access_token', accesstoken);
        localStorage.setItem('userid', userID);
        navigate(`/account/${userID}`);    
    } catch (error) {
        console.error('Error:', error);
    }

  };

  return (
    <div>
        <Header/>
        <div className="container">
        <form className="signin-box" onSubmit={handleSubmit}>
            <h2 className="create-account-title">Sign in</h2>
            <div className="signform-fields">
                <div className="signform-group">
                    <label htmlFor="yourEmail" className="field-label">Email</label>
                    <input type="text" id="yourEmail" className="form-control" value={yourEmail} onChange={handleInputChange} />
                    {errors.yourEmail && <p className="error-message">{errors.yourEmail}</p>}
                </div>
                <div className="signform-group">
                    <label htmlFor="yourPassword" className="field-label">Password</label>
                    <input type="password" id="yourPassword" className="form-control" value={yourPassword} onChange={handleInputChange} />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
            </div>
            <button type="submit" className="signin-submit-button">
                Sign in
            </button>
            <div className="sign-up-link">
                <hr className="separator-signin" />
                <span className="separator-text">New to <span className="bold-er">Life's</span> <span className="bold-more">Library</span>?</span>
                <hr className="separator-signin" />
            </div>
            <button className="signup-link-button" onClick={handleRedirectToSignup}>
                Sign up
            </button>
        </form>
            <div className="copyright-text">
            ©AlAskA Corporation
            </div>
        </div>  

    </div>
  );
};

export default LogIn;