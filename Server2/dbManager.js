/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) and GitHub Copilot GPT-4.1 was used to assist
    with coding and commenting of this file.
*/

import 'dotenv/config';
import mysql from 'mysql2';
import MESSAGES from './lang/messages/en.js';

/*
    This file handles everything related to the database.
    It connects to MySQL using values from the .env file,
    creates the "patient" table if it doesn’t already exist,
    and runs SQL queries sent from the backend server.
*/

class DBManager {

    constructor() {
        // Connect to the MySQL database using environment variables
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        // Try to connect and handle any connection errors
        this.connection.connect((err) => {
            if (err) {
                console.error('Database connection failed:', err.message);
                return;
            }
            console.log(MESSAGES.DB_CONNECTED);

            // Create the "patient" table if it doesn't exist yet
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS patient (
                    patientid INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100),
                    dateOfBirth DATETIME
                )
            `;

            // Run the query that checks or creates the table
            this.connection.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                } else {
                    console.log(MESSAGES.TABLE_CREATED);
                }
            });
        });
    }

    /*
        This function takes a SQL query and runs it on the database.
        It returns a Promise so we can handle the result asynchronously.
        If the query works, we return the result.
        If it fails, we log the error message.
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
