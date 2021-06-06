import React, { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
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
  const [form, setForm] = useState({ formData: [] });
  const { formID } = useParams();
  useEffect(
    function () {
      axios.get(`/api/form/${formID}/read`).then(({ data }) => {
        if (data.message === "success") {
          setForm(() => data.data);
        }
      });
    },
    [formID]
  );
  return (
    <div>
      <h1>{form.title}</h1>
      <div>
        <form action={`/api/form/${formID}/record`} method="POST">
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

function EditForm() {
  const { formID } = useParams();
  return <div>Edit Form {formID}</div>;
}

function ResponseForm() {
  const { formID } = useParams();
  return <div>Form Response {formID}</div>;
}
