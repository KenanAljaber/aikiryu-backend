const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS contact (
    id UUID PRIMARY KEY,
    first_name varchar(80) NOT NULL,
    last_name varchar(80) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    phone varchar(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS request(
    id UUID PRIMARY KEY,
    message TEXT NOT NULL,
    contact_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contact(id)
);

`;

module.exports = {
    connect: async () => {
        try {
            await client.connect();
            console.log('[+] Connected to PostgreSQL');
            const result = await client.query(CREATE_TABLE_QUERY);

            if (result) {
                console.log('[+] Table created successfully');
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