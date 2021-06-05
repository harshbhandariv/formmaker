import React from "react";
import {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export default function Form() {
  const route = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route exact path={route.path}>
          <Redirect to="/" />
        </Route>
        <Route path={`${route.path}/:formID`}>
          <Next />
        </Route>
      </Switch>
    </div>
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
  const { formID } = useParams();
  return <div>View Form {formID}</div>;
}

function EditForm() {
  const { formID } = useParams();
  return <div>Edit Form {formID}</div>;
}

function ResponseForm() {
  const { formID } = useParams();
  return <div>Form Response {formID}</div>;
}
