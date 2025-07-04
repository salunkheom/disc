import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import signupvalidation from './Signupvalidation';

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '', // Removed lastName
    password: ''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    // FIX: Correctly update state for input fields
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // FIX: Calculate errors immediately and use the calculated result
    const validationErrors = signupvalidation(values);
    setErrors(validationErrors); // Update state for displaying errors

    // Check if there are NO validation errors before sending to backend
    // Object.values(validationErrors).every(error => error === '') checks if all error strings are empty
    if (Object.values(validationErrors).every(error => error === '')) {
      axios.post('http://localhost:3001/signup', values) // Ensure port matches server.js
        .then(response => {
          if (response.data.success) { // Check for success flag from backend
            navigate('/flog'); // Redirect to login page on successful signup
            console.log('User registered successfully!', response.data.message);
          } else {
            console.error('Signup failed from backend:', response.data.error);
            alert(response.data.error || "Signup failed. Please try again."); // Display backend error
          }
        })
        .catch(error => {
          console.error('There was an error registering the user!', error);
          if (error.response) {
            // More specific error from backend (e.g., 409 for duplicate email)
            console.error('Backend error data:', error.response.data);
            console.error('Backend error status:', error.response.status);
            alert(error.response.data.error || "An unexpected error occurred during signup.");
          } else {
            alert("Network error or server unreachable. Please try again later.");
          }
        });
    }
  }

  return (
    <div className="App my-3  flex items-center justify-center bg-gray-100  font-inter">
      <div className="login h-100 w-75 mx-auto  p-3">
        <h2>sign up</h2>
        <p>stay updated on your professional world</p>

        <form id="form" className='border shadow-lg px-3 ' onSubmit={handleSubmit}>
          <div className="d-flex flex-column flex-lg-row flex-md-row w-100 justify-content-center align-items-center">
            <label htmlFor="name" className='w-50 ms-5'> Name:</label>
            <input type="text" onChange={handleInput} placeholder="Name" name="name" id="name" />
            {errors.name && <p className='text-danger m-2'>{errors.name}</p>}
          </div>
          {/* Removed Last Name input field */}
          <div className="d-flex flex-column flex-md-row flex-lg-row w-100 justify-content-center align-items-center">
            <label htmlFor="email" className='w-50 ms-5'> Email:</label>
            <input type="text" onChange={handleInput} placeholder="Email" name="email" id="email" />
            {errors.email && <p className='text-danger m-2'>{errors.email}</p>}
          </div>
          <div className="d-flex flex-column flex-md-row flex-lg-row justify-content-center w-100 align-items-center">
            <label htmlFor="password" className='w-50 ms-5'> Password:</label>
            <input type="password" onChange={handleInput} placeholder="Password" name="password" id="password" /> {/* Changed type to password */}
            {errors.password && <p className='text-danger mt-2'>{errors.password}</p>}
          </div>

          <button type='submit' className="btn-f">
            sign up
          </button>

        
          
          <Link to="/flog" className='text-decoration-none'>Login</Link>
        </form>
      </div>
    </div>
  )
}