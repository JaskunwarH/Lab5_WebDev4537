/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) was used to assist
    with explanation and commenting of this file.
*/

import MESSAGES from './lang/messages/en.js';

/*
    This file makes sure that the SQL queries sent to the server are safe.
    It only allows SELECT and INSERT commands, and blocks any risky ones
    like DELETE, DROP, UPDATE, or ALTER. This helps prevent damage to the database.
*/
class QueryValidator {

    /*
        This function checks if a SQL query is valid or not.
        It returns an object saying if it’s valid, and a message if there’s a problem.
    */
    static isValid(query) {
        // If the query is empty or not a string, return invalid
        if (!query || typeof query !== 'string') {
            return { valid: false, message: MESSAGES.BAD_REQUEST };
        }

        // Convert the query to uppercase so checking is easier
        const upperQuery = query.trim().toUpperCase();

        // These are the words that should never appear in the query
        const forbidden = ['DROP', 'DELETE', 'UPDATE', 'ALTER'];

        // Go through each forbidden word and check if it’s found in the query
        for (const word of forbidden) {
            if (upperQuery.includes(word)) {
                return { valid: false, message: MESSAGES.INVALID_QUERY };
            }
        }

        // Only allow SELECT or INSERT at the start of the query
        if (upperQuery.startsWith('SELECT') || upperQuery.startsWith('INSERT')) {
            return { valid: true };
        }

        // Anything else is not allowed
        return { valid: false, message: MESSAGES.INVALID_QUERY };
    }
}

export default QueryValidator;
