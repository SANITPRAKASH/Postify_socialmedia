import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate to login page if the user is not logged in
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]); // Dependency array includes 'user' to watch for changes

    return <>{children}</>;
};
ProtectedRoutes.propTypes = {
    children: PropTypes.node.isRequired,
};


export default ProtectedRoutes;
