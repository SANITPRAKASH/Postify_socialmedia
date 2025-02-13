import DataUriParser from "datauri/parser.js"; // Importing the DataUriParser from the datauri package
import path from "path"; // Importing path to handle file extensions

// Create an instance of DataUriParser
const parser = new DataUriParser();

// Function to convert image file buffer to Data URI
const getDataUri = (file) => {
    // Extract the file extension from the file name (e.g., .jpg, .png)
    const extName = path.extname(file.originalname).toString();
    
    // Convert the file buffer to Data URI format using the file extension and buffer
    return parser.format(extName, file.buffer).content;
};

// Export the function
export default getDataUri;
