const express = require('express');
const { getUserProfile } = require('../controllers/userController');
const router = express.Router();
const loggedIn = require("../utils/loggedIn");

router.get('/profile', loggedIn, function(req, res) {
    return getUserProfile(req.user._id, function done(err, user) {
        console.log(err, user, "From userRoute");
        if(err) return res.status(500).send({
            message: "Internal Server Error"
        });
        const {name, email, username, profilePicture} = user;
        res.send({message: "success",data: {name, email, username, profilePicture}});
    });
});
module.exports = router;