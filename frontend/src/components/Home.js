import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Home() {
  const [loggedIn] = useContext(AuthContext);
  if (loggedIn.Authenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div>
      <h1>Home</h1>
      <div>
        Make Beautiful forms to take survey and get powerful analytical tools
      </div>
      <div>
        <h1>Authenticate</h1>
        <a href="http://localhost:3500/auth/github">
          Authenticate using GitHub
        </a>
      </div>
    </div>
  );
}
