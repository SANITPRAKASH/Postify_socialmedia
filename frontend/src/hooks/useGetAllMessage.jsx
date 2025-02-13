import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        if (!selectedUser?._id) return; // Check if selectedUser is available

        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser._id}`, { withCredentials: true });
                if (res.data.success) {  
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllMessage();

        // Optional: Cleanup function if needed for canceling requests
        return () => {
            // You can cancel the request here if needed, using something like axios.CancelToken
        };
    }, [selectedUser, dispatch]); // Re-run the effect if selectedUser changes
};

export default useGetAllMessage;
