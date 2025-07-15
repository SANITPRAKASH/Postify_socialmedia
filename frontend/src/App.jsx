import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import ChatPage from './components/ChatPage';
import Login from './components/Login';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import { io } from 'socket.io-client';


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <Home /> },
      { path: '/profile/:id', element: <Profile /> },
      {
        path: '/account/edit', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      { path: '/chat', element: <ChatPage /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('https://postify-socialmedia.onrender.com', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App;
