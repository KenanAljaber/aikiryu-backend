const jwt=require('jsonwebtoken');

const auth=async  (req, res, next)=> {
    try {
        const token= req.header('Authoriztion') || req.cookies?.token || req.query?.token;
        if(!token){
            return res.redirect('/login');
        }
        const decoded =await jwt.verify(token,process.env.SECRET_KEY)
        console.log(`[+] decoded is `,decoded);
        console.log(`[+] user is `,decoded.user);
        req.user=decoded.user;

        next();

    } catch (error) {
        console.log(`[!] error validating token `,error);
        return res.redirect('/login');
    }
}

module.exports = auth;