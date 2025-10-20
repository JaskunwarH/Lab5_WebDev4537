/*
    Author: Jaskunwar Hunjan and Daniel Wang
    ChatGPT-5 (https://chat.openai.com/) and GitHub Copilot GPT-4.1 was used to assist
    with coding and commenting of this file.
*/

import MESSAGES from '../lang/messages/en.js';

/**
 * Main application class that handles all frontend functionality
 */
class PatientDatabaseApp {
    constructor() {
        // this.serverUrl = 'http://localhost:8080';
        this.serverUrl = 'https://jaskunwar-danton-lab5-server2.onrender.com';
        this.samplePatients = [
            "('Sara Brown', '1901-01-01')",
            "('John Smith', '1941-01-01')",
            "('Jack Ma', '1961-01-30')",
            "('Elon Musk', '1999-01-01')"
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.loadMessages();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.elements = {
            headerTitle: document.getElementById('headerTitle'),
            instructionSample: document.getElementById('instructionSample'),
            instructionQuery: document.getElementById('instructionQuery'),
            labelQuery: document.getElementById('labelQuery'),
            labelResults: document.getElementById('labelResults'),
            btnInsertSample: document.getElementById('btnInsertSample'),
            btnExecuteQuery: document.getElementById('btnExecuteQuery'),
            sqlQuery: document.getElementById('sqlQuery'),
            sampleResults: document.getElementById('sampleResults'),
            queryResults: document.getElementById('queryResults')
        };
    }

    /**
     * Set up event listeners for buttons
     */
    setupEventListeners() {
        this.elements.btnInsertSample.addEventListener('click', () => {
            this.insertSampleData();
        });

        this.elements.btnExecuteQuery.addEventListener('click', () => {
            this.executeQuery();
        });

        // Allow Enter key to execute query (Ctrl+Enter for textarea)
        this.elements.sqlQuery.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.executeQuery();
            }
        });
    }

    /**
     * Load messages from the messages file into the UI
     */
    loadMessages() {
        this.elements.headerTitle.textContent = MESSAGES.HEADER_TITLE;
        this.elements.instructionSample.textContent = MESSAGES.INSTRUCTION_SAMPLE;
        this.elements.instructionQuery.textContent = MESSAGES.INSTRUCTION_QUERY;
        this.elements.labelQuery.textContent = MESSAGES.LABEL_SQL_QUERY;
        this.elements.labelResults.textContent = MESSAGES.LABEL_RESULTS;
        this.elements.btnInsertSample.textContent = MESSAGES.BTN_INSERT_SAMPLE;
        this.elements.btnExecuteQuery.textContent = MESSAGES.BTN_EXECUTE_QUERY;
        this.elements.sqlQuery.placeholder = MESSAGES.PLACEHOLDER_QUERY;
        document.title = MESSAGES.PAGE_TITLE;
    }

    /**
     * Insert sample patient data
     */
    async insertSampleData() {
        try {
            this.setButtonState(this.elements.btnInsertSample, false, MESSAGES.INFO_INSERTING);
            this.showResult(this.elements.sampleResults, MESSAGES.INFO_INSERTING, 'info');

            const insertQuery = `INSERT INTO patient (name, dateOfBirth) VALUES ${this.samplePatients.join(', ')};`;

            const response = await this.sendRequest('POST', insertQuery);

            if (response.error) {
                this.showResult(this.elements.sampleResults, `${MESSAGES.ERROR_SERVER}: ${response.error}`, 'error');
            } else {
                this.showResult(
                    this.elements.sampleResults,
                    `${MESSAGES.SUCCESS_SAMPLE_INSERTED}\n${JSON.stringify(response, null, 2)}`,
                    'success'
                );
            }
        } catch (error) {
            this.showResult(this.elements.sampleResults, `${MESSAGES.ERROR_NETWORK}: ${error.message}`, 'error');
        } finally {
            this.setButtonState(this.elements.btnInsertSample, true, MESSAGES.BTN_INSERT_SAMPLE);
        }
    }

    /**
     * Execute user-entered SQL query
     */
    async executeQuery() {
        const query = this.elements.sqlQuery.value.trim();

        if (!query) {
            this.showResult(this.elements.queryResults, MESSAGES.ERROR_EMPTY_QUERY, 'error');
            return;
        }

        if (!this.isValidQuery(query)) {
            this.showResult(this.elements.queryResults, MESSAGES.ERROR_INVALID_QUERY, 'error');
            return;
        }

        try {
            this.setButtonState(this.elements.btnExecuteQuery, false, MESSAGES.INFO_EXECUTING);
            this.showResult(this.elements.queryResults, MESSAGES.INFO_EXECUTING, 'info');

            // Always send as POST body (Render blocks SQL keywords in URL)
            const response = await this.sendRequest('POST', query);

            if (response.error) {
                this.showResult(this.elements.queryResults, `${MESSAGES.ERROR_SERVER}: ${response.error}`, 'error');
            } else {
                this.showResult(
                    this.elements.queryResults,
                    `${MESSAGES.SUCCESS_QUERY_EXECUTED}\n${JSON.stringify(response, null, 2)}`,
                    'success'
                );
            }
        } catch (error) {
            this.showResult(this.elements.queryResults, `${MESSAGES.ERROR_NETWORK}: ${error.message}`, 'error');
        } finally {
            this.setButtonState(this.elements.btnExecuteQuery, true, MESSAGES.BTN_EXECUTE_QUERY);
        }
    }

    /**
     * Validate if query is allowed (only SELECT and INSERT)
     */
    isValidQuery(query) {
        const normalizedQuery = query.trim().toUpperCase();
        return normalizedQuery.startsWith('SELECT') || normalizedQuery.startsWith('INSERT');
    }

    /**
     * Send HTTP request to the server (always POST JSON)
     */
    async sendRequest(method, query) {
        const response = await fetch(`${this.serverUrl}/lab5/api/v1/sql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Display results in the specified element
     */
    showResult(element, message, type = 'info') {
        element.textContent = message;
        element.className = `results ${type}`;
        element.style.display = 'block';
    }

    /**
     * Set button state (enabled/disabled) and text
     */
    setButtonState(button, enabled, text) {
        button.disabled = !enabled;
        button.textContent = text;
    }
}

/**
 * Initialize the application when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    new PatientDatabaseApp();
});
