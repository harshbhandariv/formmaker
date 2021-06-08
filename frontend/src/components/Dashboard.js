import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory, Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Dashboard() {
  const [profile, setProfile] = useState({});
  const [forms, setForms] = useState([]);
  const history = useHistory();
  const [loggedIn, toggleAuthentication] = useContext(AuthContext);
  function handleLogout() {
    axios.get("/auth/logout").then(({data}) => {
      if (data.message === "Logout Succesful") {
        toggleAuthentication();
      }
    });
  }
  function handleClick() {
    axios.post("/api/form/create").then(({data}) => {
      if (data.message === "success") {
          history.push(`/form/${data.data._id}/edit`);
      }
    });
  }
  useEffect(function () {
    axios.get("/api/user/profile").then(({ data }) => {
      if (data.message === "success") {
        setProfile(data.data);
      }
    });
    axios.get("/api/form/all").then(({ data }) => {
      if (data.message === "success") {
        setForms(data.data.forms);
      }
    });
    return () => {
      setProfile({});
      setForms([]);
    };
  }, []);
  function handleDelete(id) {
    axios.delete(`/api/form/${id}/delete`).then(({data}) => {
      if(data.message === "success") {
        axios.get("/api/form/all").then(({ data }) => {
          if (data.message === "success") {
            setForms(data.data.forms);
          }
        });
      }
    })
  }
  if (!loggedIn.Authenticated) return <Redirect to="/" />;
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <h1>Profile</h1>
        <div>
          <div>Name: {profile.name}</div>
          <div>Email: {profile.email}</div>
          <div>Username: {profile.username}</div>
          <div>Profile Picture: {profile.profilePicture}</div>
        </div>
      </div>
      <div>
        <h1>Forms</h1>
        <div>
          {forms.map((form) => (
            <div key={form._id}>
              <Link to={`/form/${form._id}/view`}>{form.title}</Link>{" "}
              <Link to={`/form/${form._id}/view`}>View</Link>{" "}
              <Link to={`/form/${form._id}/edit`}>Edit</Link>{" "}
              <Link to={`/form/${form._id}/response`}>Response</Link>{" "}
              <button onClick={() => handleDelete(form._id)}>Delete</button>
            </div>
          ))}
        </div>
        <div>
            <button onClick={handleClick}>Create New Form</button>
        </div>
      </div>
    </div>
  );
}
