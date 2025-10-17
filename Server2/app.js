/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) and GitHub Copilot GPT-4.1 was used to assist
    with coding and commenting of this file.
*/

import http from 'http';
import DBManager from './dbManager.js';
import QueryValidator from './queryValidator.js';
import MESSAGES from './lang/messages/en.js';

/**
 * app.js
 * This file creates the backend HTTP server for Lab 5.
 * - Handles GET (server status) and POST (SQL query) requests.
 * - Uses DBManager to interact with MySQL.
 * - Uses QueryValidator to block unsafe queries.
 * - Sends responses in JSON format.
 */

// Create one database manager for the whole server
const db = new DBManager();
const PORT = 8080;

// Create HTTP server using Node's built-in 'http' module
const server = http.createServer(async (req, res) => {
    // Enable CORS so Server1 (frontend) can access this backend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight (OPTIONS) requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle GET request — basic server check
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: MESSAGES.SERVER_RUNNING }));
        return;
    }

    // Handle POST request — executes SQL queries
    if (req.method === 'POST') {
        let body = '';

        // Collect data from the request
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Once all data is received
        req.on('end', async () => {
            try {
                const query = body.trim();

                // Validate query before executing
                const validation = QueryValidator.isValid(query);
                if (!validation.valid) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: validation.message }));
                    return;
                }

                // Execute the query and return results
                const result = await db.executeQuery(query);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: MESSAGES.QUERY_SUCCESS,
                    result
                }));
            } catch (error) {
                console.error('Error handling POST request:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: MESSAGES.QUERY_FAILED }));
            }
        });
    } else {
        // Any other HTTP method → not supported
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
});

// Start listening on the specified port
server.listen(PORT, () => {
    console.log(MESSAGES.SERVER_RUNNING);
});
