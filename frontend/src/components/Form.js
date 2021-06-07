import React, { useState, useEffect } from "react";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import axios from "axios";

export default function Form() {
  const route = useRouteMatch();
  return (
    <Switch>
      <Route exact path={route.path}>
        <Redirect to="/" />
      </Route>
      <Route path={`${route.path}/:formID`}>
        <Next />
      </Route>
    </Switch>
  );
}

function Next() {
  const route = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${route.path}/view`}>
        <ViewForm />
      </Route>
      <Route exact path={`${route.path}/submitted`}>
        <Submitted />
      </Route>
      <Route exact path={`${route.path}/edit`}>
        <EditForm />
      </Route>
      <Route exact path={`${route.path}/response`}>
        <ResponseForm />
      </Route>
      <Route path="*">
        <div>This is not the page you are looking for</div>
      </Route>
    </Switch>
  );
}

function ViewForm() {
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
        questionType === "radio"
          ? ""
          : [...Array(options.length)].map(() => ""),
    }));
  }
  function handleChange(e, gindex, index) {
    if (e.target.type === "radio") {
      setFormState((prevState) => {
        prevState[gindex].optionSelected = e.target.value;
        localStorage.setItem(formID, JSON.stringify(prevState));
        return [...prevState];
      });
    } else {
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
    <div>
      <h1>{form.title}</h1>
      <div>
        <form
          action={`/api/form/${formID}/record`}
          method="POST"
          onSubmit={handleSubmit}
        >
          {form.formData.map(
            ({ question, questionType, _id, options }, gindex) => (
              <div key={_id}>
                <div>{question}</div>
                <div>
                  {options.map((option, index) => (
                    <div key={index}>
                      <input
                        type={questionType}
                        name={question}
                        id={option}
                        value={option}
                        checked={
                          questionType === "radio"
                            ? option === formState[gindex].optionSelected
                            : formState[gindex].optionSelected[index] === option
                        }
                        required={questionType === "radio"}
                        onChange={(e) => handleChange(e, gindex, index)}
                      />
                      <label htmlFor={option}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}

function Submitted() {
  const { formID } = useParams();
  return (
    <div>
      <h1>Response Submitted</h1>
      <Link to={`/form/${formID}/view`}>Submit Another Response</Link>
    </div>
  );
}

function EditForm() {
  const { formID } = useParams();
  return <div>Edit Form {formID}</div>;
}

function ResponseForm() {
  const [responses, setResponses] = useState([]);
  const { formID } = useParams();
  useEffect(
    function () {
      axios
        .get(`/api/form/${formID}/responses`)
        .then(({ data }) => {
          if (data.message === "success") {
            setResponses(() => data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [formID]
  );
  if (responses.length === 0)
    return (
      <div>
        <h1>Form Response {formID}</h1>
        <div>No responses yet</div>
      </div>
    );
  return (
    <div>
      <h1>Form Response {formID}</h1>
      <div>
        <table>
          <thead>
            <tr>
              {responses[0] && <th>S.No</th>}
              {responses[0] &&
                responses[0].map((question, index) => (
                  <th key={index}>{question.question}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {response.map((question, index) => (
                  <td key={index}>
                    {typeof question.optionSelected === "string"
                      ? question.optionSelected
                      : question.optionSelected
                          .filter((option) => option)
                          .join(", ")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
