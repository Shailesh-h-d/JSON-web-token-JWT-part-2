let user = (req, res, next) => {
    return req.body.password != req.body.password_repeat ? res.status(400).send("both password should match") : next();
};
module.exports = user;