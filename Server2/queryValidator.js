/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) was used to assist
    with explanation and commenting of this file.
*/

import MESSAGES from './lang/messages/en.js';

/**
 * The QueryValidator class ensures that only safe SQL commands
 * (SELECT or INSERT) are executed by the server.
 * It blocks dangerous commands like UPDATE, DELETE, DROP, and ALTER.
 */
class QueryValidator {

    /**
     * Checks if the provided SQL query is valid.
     * @param {string} query - The SQL query to check.
     * @returns {object} - { valid: boolean, message?: string }
     */
    static isValid(query) {
        if (!query || typeof query !== 'string') {
            return { valid: false, message: MESSAGES.BAD_REQUEST };
        }

        const upperQuery = query.trim().toUpperCase();

        // Forbidden keywords that must not appear
        const forbidden = ['DROP', 'DELETE', 'UPDATE', 'ALTER'];

        // Check if query contains any forbidden word
        for (const word of forbidden) {
            if (upperQuery.includes(word)) {
                return { valid: false, message: MESSAGES.INVALID_QUERY };
            }
        }

        // Only allow SELECT or INSERT statements
        if (upperQuery.startsWith('SELECT') || upperQuery.startsWith('INSERT')) {
            return { valid: true };
        }

        // If it’s none of the above, mark as invalid
        return { valid: false, message: MESSAGES.INVALID_QUERY };
    }
}

export default QueryValidator;
