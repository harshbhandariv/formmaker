const express = require("express");
const {
  getAllForms,
  createForm,
  readForm,
  submitForm,
  getResponses,
} = require("../controllers/formController");
const router = express.Router();
const loggedIn = require("../utils/loggedIn");
const checkeligible = require("../utils/checkeligible");
const { route } = require("./auth");

router.get("/:formID/read", function (req, res) {
  const { formID } = req.params;
  return readForm(formID, function done(err, form) {
    if (err)
      return res.status(500).send({
        message: "Internal Server Error",
      });
    res.send({ message: "success", data: form });
  });
});

router.post("/:formID/record", function (req, res) {
  const { formID } = req.params;
  return submitForm(formID, req.body, function done(err, result) {
    if (err)
      return res.status(500).send({
        message: "Internal Server Error",
      });
    console.log(result);
    res.send({ message: "success" });
  });
});

router.get("/all", loggedIn, function (req, res) {
  return getAllForms(req.user._id, function done(err, result) {
    if (err)
      return res.status(500).send({
        message: "Internal Server Error",
      });
    res.send({ message: "success", data: result });
  });
});

router.post("/create", loggedIn, function (req, res) {
  return createForm(req.user._id, req.body.title, function done(err, result) {
    console.log(err, result);
    if (err)
      return res.status(500).send({
        message: "Internal Server Error",
      });
    res.send({ message: "success", data: result });
  });
});

router.get("/:formID/responses", loggedIn, checkeligible, function (req, res) {
  const { formID } = req.params;
  return getResponses(formID, function done(err, result) {
    if (err)
      return res.status(500).send({
        message: "Internal Server Error",
      });
    res.send({ message: "success", data: result });
  });
});

module.exports = router;
