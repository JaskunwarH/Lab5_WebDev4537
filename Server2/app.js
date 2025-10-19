/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) and GitHub Copilot GPT-4.1 was used to assist
    with coding and commenting of this file.
*/

import http from 'http';
import { URL } from 'url';
import DBManager from './dbManager.js';
import QueryValidator from './queryValidator.js';
import MESSAGES from './lang/messages/en.js';

/*
    This file creates the backend server for Lab 5.
    The server listens for requests from the frontend (Server 1).
    - GET is used to check if the server is running.
    - POST is used to receive SQL queries and run them on the database.
    - It also checks if a query is safe before executing it.
*/

// Create one database connection using the DBManager class
const db = new DBManager();

// The port number our server will run on
const PORT = 8080;

// Create the HTTP server
const server = http.createServer(async (req, res) => {
    // Allow requests from other origins (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle the browser’s preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Handle GET request
    if (req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);

        // Check if it's a regular GET with query in body (from frontend)
        if (url.pathname === '/' && req.headers['content-type'] === 'text/plain') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const query = body.trim();

                    // For body-based GET, only allow SELECT
                    if (!query.trim().toUpperCase().startsWith('SELECT')) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Only SELECT queries allowed via GET' }));
                        return;
                    }

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
                    console.error('Error handling GET request:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: MESSAGES.QUERY_FAILED }));
                }
            });
            return;
        }

        // Default GET response - server status check
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: MESSAGES.SERVER_RUNNING }));
        return;
    }

    // Handle POST request – this is where the frontend sends SQL queries
    if (req.method === 'POST') {
        let body = '';

        // Read data that comes from the frontend
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Once all data is received, run this part
        req.on('end', async () => {
            try {
                const query = body.trim();

                // For POST requests, only allow INSERT queries
                if (!query.trim().toUpperCase().startsWith('INSERT')) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Only INSERT queries allowed via POST' }));
                    return;
                }

                // Check if the query is safe (only INSERT)
                const validation = QueryValidator.isValid(query);
                if (!validation.valid) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: validation.message }));
                    return;
                }

                // Run the query in the database
                const result = await db.executeQuery(query);

                // Send back the results to the frontend
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: MESSAGES.QUERY_SUCCESS,
                    result
                }));
            } catch (error) {
                // If something goes wrong, send an error message
                console.error('Error handling POST request:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: MESSAGES.QUERY_FAILED }));
            }
        });
    } else {
        // Any other request type (like PUT or DELETE) is not allowed
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
});

// Start the server and print a message to show it’s running
server.listen(PORT, () => {
    console.log(MESSAGES.SERVER_RUNNING);
});
