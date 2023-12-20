const { findByUsername, login, create } = require('../db/repository/adminRepository');

module.exports = (router,auth) => {
  router.get('/:username', auth, async (req, res, next) => {
    try {
      const username = req.params.username;
      if (!username) return next();
      const admin = await findByUsername(username);
      res.status(200).send(admin);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  });

  router.post('/login', async (req, res) => {
    try {
      console.log(`[+] Login request:`, req.body);
      const { username, password } = req.body;
      if (!username || !password) return res.status(401).send();
      const admin = await login({ username, password });
      if (!admin) return res.status(401).send();
      res.status(200).send(admin);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  });
  router.post('/signup', async (req, res) => {
    try {
      console.log(`[+] Signup request:`, req.body);
      const { username, password, email } = req.body;
    //   if (!username || !password || !email) return res.status(401).send();
      const admin = await create({ username, password, email });
      if (!admin) return res.status(401).send();
      res.status(200).send(admin);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  });

  return router;
};
