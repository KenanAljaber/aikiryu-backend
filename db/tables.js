const TABLES_QUERIES = {
    CONTACT: `
        CREATE TABLE IF NOT EXISTS contact (
            id UUID PRIMARY KEY,
            first_name varchar(80) NOT NULL,
            last_name varchar(80) NOT NULL,
            email varchar(100) NOT NULL UNIQUE,
            phone varchar(15) NOT NULL
        );
    `,
    REQUEST: `
        CREATE TABLE IF NOT EXISTS request(
            id UUID PRIMARY KEY,
            message TEXT NOT NULL,
            contact_id UUID NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contact(id)
        );
    `,
    ADMIN: `
        CREATE TABLE IF NOT EXISTS admin(
            id UUID PRIMARY KEY,
            username varchar(80) NOT NULL UNIQUE,
            password varchar(80) NOT NULL,
            email varchar(100) NOT NULL UNIQUE,
            reset_token varchar(80)
        );
    `,
    EVENT: `
        CREATE TABLE IF NOT EXISTS event(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP NOT NULL,
            location varchar(80) NOT NULL
        );
    `,
    EVENT_SCHEDULE: `
            CREATE TABLE IF NOT EXISTS event_schedule(
                id UUID PRIMARY KEY,
                event_id UUID NOT NULL,
                date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                day smallint NOT NULL CHECK (day >= 1 AND day <= 7),
                is_suspended BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (event_id) REFERENCES event(id)

            );
            `
};

module.exports = TABLES_QUERIES;
