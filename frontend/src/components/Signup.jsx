import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';  // Input component (UI element)
import { Button } from './ui/button'; // Button component (UI element)
import axios from 'axios';  // HTTP client for making requests
import { toast } from 'sonner';  // Notification library for alerts
import { Link, useNavigate } from 'react-router-dom';  // For routing
import { Loader2 } from 'lucide-react';  // Spinner for loading state
import { useSelector } from 'react-redux';  // To access the Redux store

const Signup = () => {
  // State to store user inputs: username, email, and password
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });

  // State for managing the loading state of the signup process
  const [loading, setLoading] = useState(false);

  // Accessing the authenticated user state from Redux store
  const { user } = useSelector(store => store.auth);

  // Navigate hook to programmatically navigate to different pages
  const navigate = useNavigate();

  // Event handler to capture input field changes and update state
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Signup form submission handler
  const signupHandler = async (e) => {
    e.preventDefault();  // Prevents page reload on form submission
    try {
      setLoading(true);  // Starts loading state

      // Sending POST request to backend for user registration
      const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,  // Ensure credentials are sent with request
      });

      // Handling successful signup response
      if (res.data.success) {
        navigate("/login");  // Redirect to login page
        toast.success(res.data.message);  // Show success message
        setInput({ username: "", email: "", password: "" });  // Clear form fields
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'An error occurred!');  // Show error message
    } finally {
      setLoading(false);  // Stop loading state
    }
  };

  // UseEffect hook to redirect user to homepage if they are already logged in
  useEffect(() => {
    if (user) {
      navigate("/");  // Redirect to homepage if user is logged in
    }
  }, [user, navigate]);

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
        </div>
        
        {/* Username Input */}
        <div>
          <span className='font-medium'>Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        {/* Email Input */}
        <div>
          <span className='font-medium'>Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        {/* Password Input */}
        <div>
          <span className='font-medium'>Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        {/* Conditional rendering for the submit button based on the loading state */}
        {
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit'>Signup</Button>
          )
        }

        {/* Login Link for users who already have an account */}
        <span className='text-center'>
          Already have an account? 
          <Link to="/login" className='text-blue-600'>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
