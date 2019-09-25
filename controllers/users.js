const database = require ('../db_api/users')

function post(req, res, next) {
    var user = {
        email: req.body.email
    };
    var unhashedPassword = req.body.password;
 
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
 
        bcrypt.hash(unhashedPassword, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
 
            user.hashedPassword = hash;
 
            insertUser(user, function(err, user) {
                var payload;
 
                if (err) {
                    return next(err);
                }
 
                payload = {
                    sub: user.email,
                    role: user.role
                };
 
                res.status(200).json({
                    user: user,
                    token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
                });
            });
        });
    });
}

module.exports.post = post;