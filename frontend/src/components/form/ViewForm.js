import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import "./ViewForm.css";

export default function ViewForm() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState([]);
  const { formID } = useParams();
  const history = useHistory();
  useEffect(
    function () {
      setLoading(true);
      axios.get(`/api/form/${formID}/read`).then(({ data }) => {
        if (data.message === "success") {
          let x = setUpFormState(data.data.formData);
          if (localStorage.getItem(formID)) {
            setFormState(() => JSON.parse(localStorage.getItem(formID)));
          } else setFormState(() => x);
          setForm(() => data.data);
          setLoading(() => false);
        }
      });
    },
    [formID]
  );
  function setUpFormState(formData) {
    return formData.map(({ question, questionType, options }) => ({
      question,
      questionType,
      optionSelected:
        questionType === "checkbox"
          ? [...Array(options.length)].map(() => "")
          : "",
    }));
  }
  function handleChange(e, gindex, index) {
    if (e.target.type === "text") {
      return setFormState((prevState) => {
        prevState[gindex].optionSelected = e.target.value;
        localStorage.setItem(formID, JSON.stringify(prevState));
        return [...prevState];
      });
    }
    if (e.target.type === "radio") {
      setFormState((prevState) => {
        prevState[gindex].optionSelected = e.target.value;
        localStorage.setItem(formID, JSON.stringify(prevState));
        return [...prevState];
      });
    }
    if (e.target.type === "checkbox") {
      setFormState((prevState) => {
        let x = prevState.map((question, ind) => {
          if (gindex !== ind) return question;
          return {
            ...question,
            optionSelected: question.optionSelected.map((option, index1) => {
              if (index !== index1) return option;
              return option === e.target.value ? "" : e.target.value;
            }),
          };
        });
        localStorage.setItem(formID, JSON.stringify(x));
        return x;
      });
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios.post(`/api/form/${formID}/record`, formState).then(({ data }) => {
      if (data.message === "success") {
        localStorage.removeItem(formID);
        setFormState(() => setUpFormState(form.formData));
        history.push(`/form/${formID}/submitted`);
      }
    });
  }
  if (loading) return <div>Loading...</div>;
  return (
    <div className="view-form">
      <div>
        <h1 className="form-view-title">{form.title}</h1>
        <div>
          <form onSubmit={handleSubmit}>
            {form.formData.map(
              ({ question, questionType, _id, options }, gindex) => (
                <div key={_id} className="form-control">
                  <div className="view-question">{question}</div>
                  <div>
                    {questionType === "text" ? (
                      <input
                        type="text"
                        className="view-text"
                        value={formState[gindex].optionSelected}
                        required
                        onChange={(e) => {
                          handleChange(e, gindex);
                        }}
                      />
                    ) : (
                      options.map((option, index) => (
                        // <div key={index}>
                        <label
                          htmlFor={`option${gindex}${index}`}
                          key={index}
                          className="view-label"
                        >
                          <input
                            type={questionType}
                            name={question}
                            id={`option${gindex}${index}`}
                            value={option}
                            checked={
                              questionType === "radio"
                                ? option === formState[gindex].optionSelected
                                : formState[gindex].optionSelected[index] ===
                                  option
                            }
                            required={questionType === "radio"}
                            onChange={(e) => handleChange(e, gindex, index)}
                          />

                          {option}
                        </label>
                        // </div>
                      ))
                    )}
                  </div>
                </div>
              )
            )}
            <button className="view-submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
