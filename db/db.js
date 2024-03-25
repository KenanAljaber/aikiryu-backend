const { Client } = require('pg');
const TABLES_QUERIES = require('./tables');

let client = null;

const CREATE_TABLE_QUERY = TABLES_QUERIES.CONTACT + TABLES_QUERIES.REQUEST + TABLES_QUERIES.ADMIN + TABLES_QUERIES.EVENT + TABLES_QUERIES.EVENT_SCHEDULE;

module.exports = {
    connect: async () => {
        let retries = 5; // Maximum number of retry attempts
        while (retries > 0) {
            try {
                client = new Client({
                    user: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    host: process.env.DB_HOST,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT,
                });
                await client.connect();
                console.log('[+] Connected to PostgreSQL');
                const result = await client.query(CREATE_TABLE_QUERY);
                if (result) {
                    console.log('[+] Tables created successfully');
                }
                return; // Exit the loop if connection and table creation are successful
            } catch (error) {
                retries--;
                console.log(`[!] Could not connect to PostgreSQL:`, error);
                console.log(`[!] Retries left: ${retries}`);
                if (retries === 0) {
                    console.log('[!] Max retries reached, exiting...');
                    process.exit(1); // Exit the process if maximum retries reached
                }
                await client.end();
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
            }
        }
    },
    query: async (query, values) => {
        try {
            const result = await client.query(query, values);
            return result;
        } catch (error) {
            console.log(`[!] Could not execute query:`, error);
        }
    }
};
