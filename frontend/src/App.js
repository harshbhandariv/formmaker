import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";
import Home from "./components/Home";
import AuthContext from "./context/AuthContext";

function App() {
  const [loggedIn, setLoggedIn] = useState({ Autenticated: false });
  useEffect(function () {
    axios
      .get("/auth/loggedIn")
      .then(function (res) {
        if (res.data.loggedIn) setLoggedIn({ Authenticated: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  function toggleAuthentication() {
    setLoggedIn((loggedIn) => !loggedIn);
  }

  return (
    <div className="App">
      <AuthContext.Provider value={[loggedIn, toggleAuthentication]}>
        <Router>
          <Switch>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/form">
              <Form />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <div>This is not the page your are looking for</div>
            </Route>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
