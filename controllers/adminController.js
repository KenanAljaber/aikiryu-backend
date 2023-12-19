const { findByUsername, login } = require('../db/repository/adminRepository');

module.exports= (app) => {
    app.get('/admin/:username', authMiddleware ,async (req, res, next) => {
        try {
            
            const username = req.params.username;
            if (!username) return next();
            const admin = await findByUsername(username);
            res.status(200).send(admin);
        } catch (error) {
            return res.status(error.status || 500).send(error);
        }
    });

    app.post('/admin/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) return res.status(401).send();
            const admin = await login({username,password});
            if (!admin) return res.status(401).send();
            res.status(200).send(admin);
        } catch (error) {
            return res.status(error.status || 500).send(error);
        }
    })
}