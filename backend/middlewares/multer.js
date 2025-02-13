import multer from "multer";

// Set up multer to store uploaded files in memory
const upload = multer({
    storage: multer.memoryStorage(), // Store file in memory
});

// Export the upload middleware for use in routes
export default upload;
