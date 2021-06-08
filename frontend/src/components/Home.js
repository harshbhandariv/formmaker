import React, { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from 'axios';

export default function Home() {
  const [loggedIn] = useContext(AuthContext);
  const [flash, setFlash] = useState({});
  useEffect(function() {
    axios.get('/flash').then(({data}) => {
      setFlash(() => data);
    });
  }, []);
  if (loggedIn.Authenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div>
      <div>{flash.error}</div>
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
