/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) and GitHub Copilot GPT-4.1 was used to assist
    with coding and commenting of this file.
*/

import 'dotenv/config';
import mysql from 'mysql2';
import MESSAGES from './lang/messages/en.js';

/**
 * The DBManager class handles all database operations:
 * - Connects to MySQL using environment variables from the .env file
 * - Creates the "patient" table if it doesn't exist
 * - Executes SQL queries (INSERT or SELECT)
 */
class DBManager {

    constructor() {
        // Create connection using values from the .env file
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        // Try connecting to the database
        this.connection.connect((err) => {
            if (err) {
                console.error('Database connection failed:', err.message);
                return;
            }
            console.log(MESSAGES.DB_CONNECTED);

            // Create the "patient" table automatically if it doesn’t exist
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS patient (
                    patientid INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100),
                    dateOfBirth DATETIME
                )
            `;

            this.connection.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log(MESSAGES.TABLE_CREATED);
                }
            });
        });
    }

    /**
     * Executes a given SQL query and returns the result.
     * @param {string} query - The SQL statement (INSERT or SELECT).
     * @returns {Promise<object>} - Promise that resolves with query result.
     */
    executeQuery(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (err, results) => {
                if (err) {
                    console.error(MESSAGES.QUERY_FAILED, err.message);
                    reject(err);
                } else {
                    console.log(MESSAGES.QUERY_SUCCESS);
                    resolve(results);
                }
            });
        });
    }
}

export default DBManager;
