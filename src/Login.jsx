import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loginvalidation from './Loginvalidation';
import axios from 'axios';

export default function Login() {
    const [values, setValues] = useState({
        username:'',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        setErrors(prev => ({ ...prev, [event.target.name]: '' }));
        setMessage('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = Loginvalidation(values);
        setErrors(validationErrors);

        if (Object.values(validationErrors).every(error => error === '')) {
            try {
                // CRITICAL CHANGE: Use relative path for Vercel Serverless Function
                const response = await axios.post('/api/login', values); // CHANGED from 'http://localhost:3001/login'

                if (response.data.success) {
                    console.log('User logged in successfully!', response.data.message);
                    setMessage('Login successful! Redirecting to profile...');

                    localStorage.setItem('userEmail', values.email);
                    localStorage.setItem('userRole', response.data.role || 'User');
                    localStorage.setItem('userName', response.data.name || 'User'); // FIXED TYPO: userNameame -> userName

                    setTimeout(() => navigate('/prof'), 1500);

                } else {
                    console.error('Login failed from backend:', response.data.error);
                    // Ensure message is always a string
                    setMessage(response.data.error || "Login failed. Please check your credentials.");
                }
            } catch (error) {
                console.error('There was an error logging in the user!', error);
                if (error.response) {
                    console.error('Backend error data:', error.response.data);
                    console.error('Backend error status:', error.response.status);
                    // Refined error handling to extract message string
                    const errorMessage = error.response.data && typeof error.response.data.error === 'object' && error.response.data.error.message
                                        ? error.response.data.error.message
                                        : (error.response.data.error || "An unexpected error occurred during login.");
                    setMessage(errorMessage);
                } else if (error.request) {
                    setMessage("No response from server. Please ensure the backend is running and accessible.");
                } else {
                    setMessage("Error setting up login request.");
                }
            }
        }
    }

    return (
        <div className="App my-3 h-full flex items-center justify-center bg-gray-100 font-inter">
            <div className="login h-100 w-75 mx-auto p-3">
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Sign In</h2>
                <p className="text-center text-gray-600 mb-6">Stay updated on your professional world</p>

                <form id='form' onSubmit={handleSubmit} className='flex items-center justify-center border h-75 shadow p-2 px-3 '>
                    <div className="d-flex flex-column flex-md-row flex-lg-row w-100 justify-content-center align-items-center">
                        <label htmlFor="username" className='text-gray-700 text-sm font-medium mb-1'>Username:</label>
                        <input
                            type="text"
                            onChange={handleInput}
                            placeholder="username"
                            value={values.username}
                            name="username"
                            id="name"
                            className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.username  && <p className='text-red-500 text-xs mt-1'>{errors.username}</p>}
                    <div className="d-flex flex-column flex-md-row flex-lg-row w-100 justify-content-center align-items-center">
                        <label htmlFor="email" className='text-gray-700 text-sm font-medium mb-1'>Email:</label>
                        <input
                            type="email"
                            onChange={handleInput}
                            placeholder="Email"
                            value={values.email}
                            name="email"
                            id="email"
                            className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}

                    <div className="d-flex flex-column flex-md-row flex-lg-row w-100 justify-content-center align-items-center">
                        <label htmlFor="password" className='w-50 ms-5 text-gray-700 text-sm font-medium mb-1'>Password:</label>
                        <input
                            type="password"
                            onChange={handleInput}
                            placeholder="Password"
                            value={values.password}
                            name="password"
                            id="password"
                            className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.password && <p className='w-50 ms-5 text-red-500 text-xs mt-1'>{errors.password}</p>}

                    <button
                        type='submit'
                        className="btn-f w-full bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
                    >
                        Sign In
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4">
                        <input type="checkbox" id="terms" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                        <label htmlFor="terms">Terms & Conditions</label>
                    </div>
<div className="text-center mt-5">
          <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        </div>
                    <Link to="/signup" className='block text-center text-blue-600 hover:underline mt-4'>
                        Create Account
                    </Link>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-md border text-center ${message.includes('successful') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
