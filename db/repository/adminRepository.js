const bcrypt=require('bcryptjs')

module.exports = {
    findByUsername,
    findByEmail,
    findByToken,
    create,
    login
}

async function findByUsername(username) {
    try {

        if (!username) {
            console.log("[!] Username is required");
            throw new Error("Username is required");
        }
        const findQuery = `SELECT * FROM admin WHERE username = $1`;
        const result = await db.query(findQuery, [username]);
        return result.rows[0];
    } catch (error) {
        console.log(`[!] Could not find admin:`, error);
    }


}

async function findByEmail(email) {
    try {
        if (!email) {
            console.log("[!] Email is required");
            throw new Error("Email is required");
        }
        const findQuery = `SELECT * FROM admin WHERE email = $1`;
        const result = await db.query(findQuery, [email]);
        return result.rows[0];
    } catch (error) {
        console.log(`[!] Could not find admin:`, error);
    }
}

async function findByToken(token) {
    try {
        if (!token) {
            console.log("[!] Token is required");
            throw new Error("Token is required");
        }
        const findQuery = `SELECT * FROM admin WHERE reset_token = $1`;
        const result = await db.query(findQuery, [token]);
        return result.rows[0];
    } catch (error) {
        console.log(`[!] Could not find admin:`, error);
    }
}

async function create(admin) {
    try {
        if(!validateAdmin(admin)) {
            console.log("[!] Admin is required");
            throw new Error("Admin is required");
        }
        let { username, password, email } = admin;
        password = await hashPassword(password);
        const insertQuery = `INSERT INTO admin (username, password, email) VALUES ($1, $2, $3) RETURNING *`;
        const result = await db.query(insertQuery, [username, password, email]);
        return result.rows[0];

    } catch (error) {
        console.log(`[!] Could not create admin:`, error);
    }
}

async function login(admin) {
    try {
        if(!admin || !admin.username || !admin.password) {
            console.log("[!] Admin is required");
            throw new Error("Admin is required");
        }
        let { username, password } = admin;
        const findQuery = `SELECT * FROM admin WHERE username = $1`;
        const result = await db.query(findQuery, [username]);
        const user = result.rows[0];
        if(!user) {
            console.log("[!] User not found");
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            console.log("[!] Password is incorrect");
            throw new Error("Password is incorrect");
        }
        return user;
    } catch (error) {
        console.log(`[!] Could not login admin:`, error);
    }
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

function validateAdmin(admin) {
    if(!admin.username || !admin.password || !admin.email) {
        return false;
    }
    return true;
}