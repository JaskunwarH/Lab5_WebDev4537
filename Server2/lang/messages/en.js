/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) was used to assist 
    with explanation and commenting of this file.
*/

// All user facing strings are stored here for easy reuse.
const MESSAGES = {
    SERVER_RUNNING: "Server is running on port 8080.",
    DB_CONNECTED: "Connected to database successfully.",
    TABLE_CREATED: "Patient table created or already exists.",
    INVALID_QUERY: "Error: Only SELECT or INSERT statements are allowed.",
    INSERT_SUCCESS: "Rows inserted successfully.",
    QUERY_SUCCESS: "Query executed successfully.",
    QUERY_FAILED: "Query failed to execute.",
    BAD_REQUEST: "Bad request. Please provide a valid SQL query."
};

export default MESSAGES;
