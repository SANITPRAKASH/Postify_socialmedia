import jwt from "jsonwebtoken";

// Middleware to verify if user is authenticated
const isAuthenticated = async (req, res, next) => {
    try {
        // Check if token exists in cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false,
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false,
            });
        }

        // Attach the user ID to the request object for future use
        req.id = decoded.userId;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.',
            success: false,
        });
    }
}

export default isAuthenticated;
