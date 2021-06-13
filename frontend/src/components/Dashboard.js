import axios from "axios";
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useHistory, Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Dashboard.css";
import del from "../assets/delete.svg";
import edit from "../assets/edit.svg";
import response from "../assets/response.svg";
import file from "../assets/file.svg";
import plus from "../assets/plus.svg";
import copy from "../assets/copy.svg";
import cancel from "../assets/cancel.svg";
import user from "../assets/user.svg";

export default function Dashboard() {
  const [profile, setProfile] = useState({});
  const [forms, setForms] = useState([]);
  const history = useHistory();
  const [loggedIn, toggleAuthentication] = useContext(AuthContext);
  const profileModal = useRef();
  function handleLogout() {
    axios.get("/auth/logout").then(({ data }) => {
      if (data.message === "Logout Succesful") {
        toggleAuthentication();
      }
    });
  }
  function handleClick() {
    axios.post("/api/form/create").then(({ data }) => {
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
    axios.delete(`/api/form/${id}/delete`).then(({ data }) => {
      if (data.message === "success") {
        axios.get("/api/form/all").then(({ data }) => {
          if (data.message === "success") {
            setForms(data.data.forms);
          }
        });
      }
    });
  }
  function handleCopy(id) {
    let text = window.location.href;
    navigator.clipboard
      .writeText(text.replace("/dashboard", `/form/${id}/view`))
      .then(
        function () {
          console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
  }
  if (!loggedIn.Authenticated) return <Redirect to="/" />;
  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="page-name">Dashboard</div>
        <div className="nav-list">
          <div
            className="nav-profile-name"
            onClick={() => {
              profileModal.current.classList.toggle("yes");
            }}
          >
            Hello, {profile.name}
          </div>
          <div
            className="nav-profile-icon"
            onClick={() => {
              profileModal.current.classList.toggle("yes");
            }}
          >
            <img src={user} className="img-icon" alt="User" />
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="main-section">
        <div className="form-section">
          <div className="form-heading">Forms</div>
          <div className="form-grid-display">
            <div className="form-grid-display-headings">
              <div>Form Title</div>
              <div>View</div>
              <div>Edit</div>
              <div>Response</div>
              <div>Delete</div>
            </div>
            {forms.map(({ _id: id, title }, index) => (
              <div className="form-grid-display-data" key={index}>
                <div className="title-div">
                  <Link
                    to={`/form/${id}/view`}
                    target="_blank"
                    className="link"
                  >
                    {title}
                  </Link>{" "}
                  <span className="copy-span" onClick={() => handleCopy(id)}>
                    <img src={copy} className="img-icon1" alt="copy" />
                  </span>
                </div>
                <div>
                  <Link
                    to={`/form/${id}/view`}
                    target="_blank"
                    className="link"
                  >
                    <img
                      src={file}
                      className="img-icon"
                      alt="View"
                      target="_blank"
                    />
                  </Link>
                </div>
                <div>
                  <Link to={`/form/${id}/edit`} className="link">
                    <img src={edit} className="img-icon" alt="Edit" />
                  </Link>
                </div>
                <div>
                  <Link to={`/form/${id}/response`} className="link">
                    <img src={response} className="img-icon" alt="Response" />
                  </Link>
                </div>
                <div>
                  <img
                    src={del}
                    onClick={() => handleDelete(id)}
                    className="img-icon"
                    alt="Delete"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="div-create-btn">
            <button className="create-btn" onClick={handleClick}>
              <img src={plus} className="img-icon1" alt="" /> Create new Form
            </button>
          </div>
        </div>
      </div>
      <div className="profile-modal-container" ref={profileModal}>
        <div className="profile-modal">
          <button
            className="btn-close"
            onClick={() => {
              profileModal.current.classList.toggle("yes");
            }}
          >
            <img className="closeimg" src={cancel} alt="" />
          </button>
          <div className="profile-picture-container">
            <img
              src={profile.profilePicture}
              alt={profile.name}
              className="profile-picture"
            />
          </div>
          <div>{profile.name}</div>
          <div>{profile.email}</div>
          <button className="logout-btn1" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
