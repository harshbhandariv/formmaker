module.exports = function loggedIn(req, res, next) {
    if(req.user) {
        next();
    }
    else {
        res.status(401).send({message: "Access Denied", loggedIn: false});
    }
}