/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) and GitHub Copilot GPT-4.1 was used to assist
    with coding and commenting of this file.
*/

const MESSAGES = {
    // Page title and headers
    PAGE_TITLE: "Patient Database Management",
    HEADER_TITLE: "Lab 5 - Patient Database",

    // Button texts
    BTN_INSERT_SAMPLE: "Insert Sample Patients",
    BTN_EXECUTE_QUERY: "Execute Query",

    // Labels
    LABEL_SQL_QUERY: "Enter SQL Query:",
    LABEL_RESULTS: "Results:",

    // Placeholders
    PLACEHOLDER_QUERY: "Enter your SELECT or INSERT query here...",

    // Success messages
    SUCCESS_SAMPLE_INSERTED: "Sample patients inserted successfully!",
    SUCCESS_QUERY_EXECUTED: "Query executed successfully!",

    // Error messages
    ERROR_INVALID_QUERY: "Error: Only SELECT and INSERT queries are allowed.",
    ERROR_EMPTY_QUERY: "Please enter a SQL query.",
    ERROR_SERVER: "Server error occurred.",
    ERROR_NETWORK: "Network error. Please check if the server is running.",

    // Info messages
    INFO_EXECUTING: "Executing query...",
    INFO_INSERTING: "Inserting sample data...",

    // Instructions
    INSTRUCTION_QUERY: "Enter SELECT queries to read data or INSERT queries to add new patients.",
    INSTRUCTION_SAMPLE: "Click the button below to insert sample patient data."
};

export default MESSAGES;
