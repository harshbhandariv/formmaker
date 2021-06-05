// import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
