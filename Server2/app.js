/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) and GitHub Copilot GPT-4.1 was used to assist
    with coding and commenting of this file.
*/

import http from 'http';
import DBManager from './dbManager.js';
import QueryValidator from './queryValidator.js';
import MESSAGES from './lang/messages/en.js';

/*
    This file creates the backend server for Lab 5.
    The server listens for requests from the frontend (Server 1).
    - GET is used to check if the server is running.
    - POST is used to receive SQL queries (as JSON) and execute them.
    - Queries are validated for safety before running on the database.
*/

// Create one database connection using the DBManager class
const db = new DBManager();

// The port number our server will run on
const PORT = 8080;

// Create the HTTP server
const server = http.createServer(async (req, res) => {
    // Common CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle GET request — used only to confirm server status
    if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ message: MESSAGES.SERVER_RUNNING }));
        return;
    }

    // Handle POST requests (for SQL queries)
    if (req.method === 'POST' && req.url.includes('/lab5/api/v1/sql')) {
        let body = '';

        // Read data from request body
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                // Parse JSON body and extract the SQL query
                const data = JSON.parse(body);
                const query = data.query ? data.query.trim() : '';

                // Validate input
                if (!query) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ error: 'No SQL query provided' }));
                    return;
                }

                // Check if query is valid (only SELECT or INSERT)
                const validation = QueryValidator.isValid(query);
                if (!validation.valid) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ error: validation.message }));
                    return;
                }

                // Execute query in MySQL
                const result = await db.executeQuery(query);

                // Return successful response
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({
                    message: MESSAGES.QUERY_SUCCESS,
                    result
                }));

            } catch (error) {
                console.error('Error handling POST request:', error);

                res.writeHead(500, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: MESSAGES.QUERY_FAILED }));
            }
        });
        return;
    }

    // Any unsupported HTTP method
    res.writeHead(405, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
});

// Start the server and print a message
server.listen(PORT, () => {
    console.log(MESSAGES.SERVER_RUNNING);
});
