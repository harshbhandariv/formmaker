const express = require('express');
const { getAllForms, createForm, readForm } = require('../controllers/formController');
const router = express.Router();
const loggedIn = require("../utils/loggedIn");
const { route } = require('./auth');

router.get('/:formID/read', function(req, res) {
    const {formID} = req.params;
    return readForm(formID, function done(err, form) {
        if(err) return res.status(500).send({
            message: "Internal Server Error"
        });
        res.send({message: "success", data: form});
    })
})


router.post('/:formID/record', function(req, res) {
    const {formID} = req.params;
    console.log(req.body);
    res.send({message: "success"});
})

router.get('/all', loggedIn, function(req, res) {
    return getAllForms(req.user._id, function done(err, result) {
        if(err) return res.status(500).send({
            message: "Internal Server Error"
        });
        res.send({message: "success", data: result});
    });
});

router.post('/create', function(req, res) {
    return createForm(req.user._id, req.body.title, function done(err, result) {
        console.log(err, result);
        if(err) return res.status(500).send({
            message: "Internal Server Error"
        });
        res.send({message: "success", data: result});
    })
})

module.exports = router;