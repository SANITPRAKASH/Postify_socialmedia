import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);  // State for loading status
    const [error, setError] = useState(null);      // State for error handling

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);  // Set loading to true when fetching starts
                const res = await axios.get(`https://postify-socialmedia.onrender.com/api/v1/user/${userId}/profile`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user));  // Dispatch user profile to store
                } else {
                    setError('Failed to fetch user profile');  // Handle failed response
                }
            } catch (error) {
                setError('An error occurred while fetching the user profile');
                console.error(error);  // Log the error to the console
            } finally {
                setLoading(false);  // Set loading to false after fetch completes
            }
        };

        fetchUserProfile();
    }, [userId, dispatch]);  // Dependency array ensures the effect is called when userId changes

    return { loading, error };  // Return loading and error states for potential use in the UI
};

export default useGetUserProfile;
