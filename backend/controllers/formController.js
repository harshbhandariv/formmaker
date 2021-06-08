const { User } = require("../models/user");
const { Form } = require("../models/form");
function getAllForms(id, done) {
  return User.findById(id)
    .select("forms")
    .populate({ path: "forms", select: "formOwner title" })
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

    return new Form(sampleFormDocument(id, title || "untitled form")).save(
      function (err2, result1) {
        if (err2) return done(err2, null);
        user.forms.push(result1._id);

        return user.save(function (err3, newUser) {
          if (err3) return done(err3, null);
          return done(null, result1);
        });
      }
    );
  });
}

function readForm(id, done) {
  Form.findById(id)
    .select("-formResponse")
    .exec(function (err, form) {
      done(err, form);
    });
}

function submitForm(id, body, done) {
  Form.findById(id).exec(function (err, form) {
    if (err) done(err, null);
    form.formResponse.push(body);
    form.save(function (err, form1) {
      done(err, form1);
    });
  });
}

function getResponses(id, done) {
  Form.findById(id)
    .select("formResponse title")
    .exec(function (err, form) {
      done(err, form);
    });
}

function updateForm(id, body, done) {
  Form.findById(id).exec(function (err, form) {
    if (err) done(err, form);
    form.title = body.title;
    form.formData = body.formData;
    form.formResponse = [];
    form.save(function (err, result) {
      done(err, result);
    });
  });
}

function deleteForm(id, userID, done) {
  Form.deleteOne({ _id: id }, function (err) {
    if (err) return done(err, null);
    User.findById(userID).exec(function (err1, user) {
      if (err1) return done(err1, null);
      let x = [...user.forms];
      let index = x.findIndex((fid) => id == fid);
      user.forms = [...x.slice(0, index), ...x.slice(index + 1)];
      user.save(function (err3, result) {
        return done(err3);
      });
    });
  });
}

module.exports = {
  getAllForms,
  createForm,
  readForm,
  submitForm,
  getResponses,
  updateForm,
  deleteForm,
};
