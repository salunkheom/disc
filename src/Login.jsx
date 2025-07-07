import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loginvalidation from './Loginvalidation';
import axios from 'axios';

export default function Login() { // Keep the component name as Login
    const [values, setValues] = useState({
        username:'',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [message, setMessage] = useState(''); // State for custom message box

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        // Clear specific error message as user types
        setErrors(prev => ({ ...prev, [event.target.name]: '' }));
        setMessage(''); // Clear API message on new input
    }

    const handleSubmit = async (event) => { // Make handleSubmit async for await
        event.preventDefault();

        const validationErrors = Loginvalidation(values);
        setErrors(validationErrors);

        if (Object.values(validationErrors).every(error => error === '')) {
            try {
                const response = await axios.post('http://localhost:3001/login', values);

                if (response.data.success) {
                    console.log('User logged in successfully!', response.data.message);
                    setMessage('Login successful! Redirecting to profile...');

                    // --- IMPORTANT: Store user data in localStorage ---
                    // This data will then be retrieved by the Prof component
                    localStorage.setItem('userEmail', values.email);
                    localStorage.setItem('userRole', response.data.role || 'User'); // Assume backend can send a role
 localStorage.setItem('userNameame', response.data.name || 'User'); // Store the user's name
                    // Redirect to the profile page after a short delay for message visibility
                    setTimeout(() => navigate('/prof'), 1500);

                } else {
                    console.error('Login failed from backend:', response.data.error);
                    setMessage(response.data.error || "Login failed. Please check your credentials.");
                }
            } catch (error) {
                console.error('There was an error logging in the user!', error);
                if (error.response) {
                    console.error('Backend error data:', error.response.data);
                    console.error('Backend error status:', error.response.status);
                    setMessage(error.response.data.error || "An unexpected error occurred during login.");
                } else if (error.request) {
                    setMessage("No response from server. Please ensure the backend is running.");
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
                            type="text" // Changed type to email for better browser validation
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
                        <label htmlFor="username" className='text-gray-700 text-sm font-medium mb-1'>Email:</label>
                        <input
                            type="email" // Changed type to email for better browser validation
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
                            type="password" // Changed type to password for security
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

                    <Link to="/signup" className='block text-center text-blue-600 hover:underline mt-4'>
                        Create Account
                    </Link>
                </form>

                {/* Custom Message Box for API responses */}
                {message && (
                    <div className={`mt-4 p-3 rounded-md border text-center ${message.includes('successful') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                        {message}
                    </div>
                )}
            </div>
            {/* THIS IS THE LINE THAT SHOULD BE REMOVED */}
            {/* <Prof info={values.email} /> */}
        </div>
    );
}