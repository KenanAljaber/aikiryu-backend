const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {

        // Exclude authentication for specific routes
        if (req.method === 'GET' && (req.path === '/event' || req.path === '/event/:id')) {
            console.log(`[+] skipping authentication for ${req.path}`);
            return next(); // Skip authentication
        }
        let token = req.header('Authorization') || req.cookies?.token || req.query?.token;
        if (!token) {
            return res.status(302).send();
        }
        token = token.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.SECRET_KEY)
        console.log(`[+] decoded is `, decoded);
        console.log(`[+] user is `, decoded.user);
        req.user = decoded.user;

        next();

    } catch (error) {
        console.log(`[!] error validating token `, error);
        return res.redirect('/login');
    }
}

module.exports = auth;