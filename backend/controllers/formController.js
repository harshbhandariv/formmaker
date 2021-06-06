const { User } = require("../models/user");
const { Form } = require("../models/form");
function getAllForms(id, done) {
  return User.findById(id)
    .select("forms")
    .populate({path:"forms", select: "formOwner title"})
    .exec(function (err, result) {
      done(err, result);
    });
}

const sampleFormDocument = (id, title) => ({
  formOwner: id,
  title: title,
  formData: [
    {
      question: "Sample Question: Which hand do you use for writing?",
      questionType: "checkbox",
      options: ["left", "right"],
    },
  ],
  formResponse: [],
});

function createForm(id, title, done) {
  return User.findById(id).exec(function (err1, user) {
    if (err1) return done(err1, null);

    return new Form(sampleFormDocument(id,title || "untitled form")).save(function (err2, result1) {

      if (err2) return done(err2, null);
      user.forms.push(result1._id)

      return user.save(function(err3, newUser) {
          if (err3) return done(err3, null);
          return done(null, result1);
      });
    });
  });
}

function readForm(id, done) {
    Form.findById(id).select("-formResponse").exec(function(err, form) {
        done(err, form);
    })
}

module.exports = { getAllForms, createForm, readForm };
