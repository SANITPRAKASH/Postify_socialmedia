import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/suggested', { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                } else {
                    // You can show an error if the response is unsuccessful
                    console.error("Failed to fetch suggested users:", res.data.message);
                }
            } catch (error) {
                // Log or handle the error accordingly
                console.error("Error fetching suggested users:", error);
                // You might want to update a state to show an error message in the UI
            }
        };
        fetchSuggestedUsers();
    }, [dispatch]); // It depends on dispatch, just to follow best practices
};

export default useGetSuggestedUsers;
