import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
      

        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`https://postify-socialmedia.onrender.com/api/v1/message/all/${selectedUser._id}`, { withCredentials: true });
                if (res.data.success) {  
                    console.log("💬 messages:", res.data.messages);
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchAllMessage();
      
    }, [selectedUser]); // Re-run the effect if selectedUser changes
};

export default useGetAllMessage;
