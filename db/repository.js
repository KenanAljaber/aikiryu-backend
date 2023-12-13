const db = require('./db')
const { v4: uuidv4 } = require('uuid');
module.exports = {
        findByEmail,
        create

}

async function findByEmail(email) {
        if (!email) {
                console.log("[!] Email is required");
                throw new Error("Email is required");
        }

        const result = await db.query(`SELECT * FROM contact WHERE email = '${email}'`);
        return result.rows[0];

}

async function create(contact) {
        const { firstName, lastName, email, phone, message } = contact;
        if (!contact || !firstName || !lastName || !email || !phone || !message) {
                console.log("[!] All fields are required");
                throw new Error("All fields are required");
        }
        try {

                const existingContact = await findByEmail(email);
                let id = existingContact?.id || uuidv4();
                if (!existingContact) {
                        console.log(`[+] contact does not exists`);
                        const contactResult = await db.query("INSERT INTO contact (id, first_name, last_name, email, phone) VALUES ($1, $2, $3, $4, $5)", [id, firstName, lastName, email, phone]);
                }
                const requestId = uuidv4();
                const obj={
                        id:requestId,
                        message:message,
                        contact_id:id,
                        created_at:new Date()
                }
                console.log(obj);
                const requestResult = await db.query("INSERT INTO request (id, message, contact_id, created_at) VALUES ($1, $2, $3, $4)", [requestId, message, id, new Date()]);


                if (requestResult) {
                        console.log(`[+] Request created successfully`);
                }
                return;
        } catch (error) {
                console.log(`[!] Could not create contact:`, error);
        }


}

