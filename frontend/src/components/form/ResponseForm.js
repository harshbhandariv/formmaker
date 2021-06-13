import axios from "axios";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./ResponseForm.css";
import user from "../../assets/user.svg";
import cancel from "../../assets/cancel.svg";
export default function ResponseForm() {
  const [profile, setProfile] = useState({});
  const [responses, setResponses] = useState([]);
  const [title, setTitle] = useState("");
  const { formID } = useParams();
  const [, toggleAuthentication] = useContext(AuthContext);
  const profileModal = useRef();
  useEffect(
    function () {
      axios.get("/api/user/profile").then(({ data }) => {
        if (data.message === "success") {
          setProfile(data.data);
        }
      });
      axios
        .get(`/api/form/${formID}/responses`)
        .then(({ data }) => {
          if (data.message === "success") {
            setResponses(() => data.data.formResponse);
            setTitle(() => data.data.title);
          }
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    [formID]
  );
  function handleLogout() {
    axios.get("/auth/logout").then(({ data }) => {
      if (data.message === "Logout Succesful") {
        toggleAuthentication();
      }
    });
  }
  if (responses.length === 0)
    return (
      <div>
        <h1>Form Response {formID}</h1>
        <div>No responses yet</div>
      </div>
    );
  return (
    <div>
      <nav className="navbar">
        <div className="page-name">Response</div>
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
      <Link to="/dashboard">Go to Dashboard</Link>
      <h1>Form Response: {title}</h1>
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
      <div className="response-links">
        <Link to="/dashboard" className="response-link">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
