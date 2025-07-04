import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Loginvalidation from './Loginvalidation';
import axios from 'axios'; // Import axios

export default function Login() { // Renamed to App for default export
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Initialize navigate
    const [message, setMessage] = useState(''); // State for custom message box

    const handleInput = (event) => {
        // Correctly update state for input fields
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        // Calculate errors immediately and use the calculated result
        const validationErrors = Loginvalidation(values);
        setErrors(validationErrors); // Update state for displaying errors

        // Check if there are NO validation errors before sending to backend
        // Object.values(validationErrors).every(error => error === '') ensures all error strings are empty
        if (Object.values(validationErrors).every(error => error === '')) {
            axios.post('http://localhost:3001/login', values) // Ensure port matches server.js
                .then(response => {
                    if (response.data.success) { // Check for success flag from backend
                        console.log('User logged in successfully!', response.data.message);
                        setMessage('Login successful! Redirecting to profile...');
                        // On successful login, you might want to redirect to a dashboard/profile page
                        setTimeout(() => navigate('/profile'), 1500); // Example: navigate to a profile page after a short delay
                    } else {
                        console.error('Login failed from backend:', response.data.error);
                        setMessage(response.data.error || "Login failed. Please check your credentials.");
                    }
                })
                .catch(error => {
                    console.error('There was an error logging in the user!', error);
                    if (error.response) {
                        console.error('Backend error data:', error.response.data);
                        console.error('Backend error status:', error.response.status);
                        setMessage(error.response.data.error || "An unexpected error occurred during login.");
                    } else {
                        setMessage("Network error or server unreachable. Please try again later.");
                    }
                });
        }
    }

    return (
        <div className="App my-3 h-full  flex items-center justify-center bg-gray-100  font-inter">
            <div className="login h-100 w-75 mx-auto  p-3">
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Sign In</h2>
                <p className="text-center text-gray-600 mb-6">Stay updated on your professional world</p>

                <form id='form' onSubmit={handleSubmit} className='flex items-center justify-center border h-75 shadow p-2 px-3 '>
                    <div className="d-flex flex-column flex-md-row flex-lg-row w-100 justify-content-center align-items-center">
                        <label htmlFor="email" className='text-gray-700 text-sm font-medium mb-1'>Email:</label>
                        <input
                            type="text"
                            onChange={handleInput}
                            placeholder="Email"
                            name="email"
                            id="email"
                            className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                    </div>

                    <div className="d-flex flex-column flex-md-row flex-lg-row w-100 justify-content-center align-items-center">
                        <label htmlFor="password" className='w-50 ms-5 text-gray-700 text-sm font-medium mb-1'>Password:</label>
                        <input
                            type="password"
                            onChange={handleInput}
                            placeholder="Password"
                            name="password"
                            id="password"
                            className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className='w-50 ms-5 text-red-500 text-xs mt-1'>{errors.password}</p>}
                    </div>

                    <button
                        type='submit'
                        className="btn-f w-full bg-blue-600 text-white  rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
                    >
                        Sign In
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
                        <input type="checkbox" id="terms" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                        <label htmlFor="terms">Terms & Conditions</label>
                    </div>

                    <Link to="/signup" className='block text-center text-blue-600 hover:underline mt-4'>
                        Create Account
                    </Link>
                </form>

                {/* Custom Message Box */}
                {message && (
                    <div className="mt-4 p-3 rounded-md bg-blue-100 text-blue-800 border border-blue-300 text-center">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

