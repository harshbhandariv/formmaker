const { Schema, model } = require("mongoose");

const formSchema = new Schema({
  formOwner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  formData: [
    {
      question: String,
      questionType: String,
      options: [String],
    },
  ],
  formResponse: [["String"]],
});

const Form = model("Form", formSchema);

module.exports = { formSchema, Form };
