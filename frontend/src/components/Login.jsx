import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth); // Access the authenticated user from redux store
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Event handler for input change
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value }); // Update the input state dynamically
    }

    // Function to handle login on form submit
    const signupHandler = async (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        try {
            setLoading(true); // Start loading state
            // Sending a POST request to login the user
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user)); // Set user in redux store
                navigate("/"); // Redirect to home page after successful login
                toast.success(res.data.message); // Display success toast
                setInput({
                    email: "",
                    password: ""
                }); // Clear the input fields after login
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message); // Display error message if login fails
        } finally {
            setLoading(false); // Reset loading state after request completes
        }
    }

    // useEffect to redirect logged-in users to home page
    useEffect(() => {
        if (user) {
            navigate("/"); // If user is logged in, redirect to home page
        }
    }, [user, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler} // Calls event handler when email is changed
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler} // Calls event handler when password is changed
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        // Show loading spinner and text when loading
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        // Show login button when not loading
                        <Button type='submit'>Login</Button>
                    )
                }

                <span className='text-center'>Doesn&apos;t have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
            </form>
        </div>
    )
}

export default Login;
