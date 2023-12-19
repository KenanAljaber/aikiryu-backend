const { Client } = require('pg');
const TABLES_QUERIES = require('./tables');


const client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const CREATE_TABLE_QUERY = TABLES_QUERIES.CONTACT + TABLES_QUERIES.REQUEST + TABLES_QUERIES.ADMIN + TABLES_QUERIES.EVENT;

module.exports = {
    connect: async () => {
        try {
            await client.connect();
            console.log('[+] Connected to PostgreSQL');
            const result = await client.query(CREATE_TABLE_QUERY);

            if (result) {
                console.log('[+] Tables created successfully');
            }

        } catch (error) {
            console.log(`[!] Could not connect to PostgreSQL:`, error);
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



}