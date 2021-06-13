import React from "react";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import ViewForm from "./form/ViewForm";
import ResponseForm from "./form/ResponseForm";
import EditForm from "./form/EditForm";

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
      <Route exact path={`${route.path}/`}>
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

function Submitted() {
  const { formID } = useParams();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Response Submitted</h1>
      <Link to={`/form/${formID}/view`} style={{ margin: "0.5em" }}>
        Submit Another Response
      </Link>
      <Link to="/" style={{ margin: "0.5em" }}>
        Go to Home
      </Link>
    </div>
  );
}
