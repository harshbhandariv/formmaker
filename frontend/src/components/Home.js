import React, { useContext, useRef } from "react";
import { Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Home.css";
import sphere from "../assets/circle.svg";
import google from "../assets/google.svg";
import github from "../assets/github.svg";
import cancel from "../assets/cancel.svg";

export default function Home() {
  const [loggedIn] = useContext(AuthContext);
  const modal = useRef();
  if (loggedIn.Authenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="home">
      <img className="circle left1" src={sphere} alt="" />
      <img className="circle left2" src={sphere} alt="" />
      <img className="circle right1" src={sphere} alt="" />
      <img className="circle right2" src={sphere} alt="" />
      <div className="heading">Form Maker</div>
      <div className="description">
        Make Beautiful forms to take survey and get powerful analytical tools
      </div>
      <button
        onClick={() => {
          modal.current.classList.toggle("yes");
        }}
        className="cta"
      >
        Get Started
      </button>
      <div className="modal-container" ref={modal}>
        <div className="modal">
          <button
            className="btn close"
            onClick={() => {
              modal.current.classList.toggle("yes");
            }}
          >
            <img className="closeimg" src={cancel} alt="" />
          </button>
          <div className="modal-header">Authenticate Yourself</div>
          <div className="authmethod google">
            <a href="http://localhost:3500/auth/google">
              <button className="authmethod-btn google">
                <img src={google} className="authicon" alt="" /> Authenticate
                using Google
              </button>
            </a>
          </div>
          {/* <div>
          <a href="http://localhost:3500/auth/twitter">
          Authenticate using Twitter
          </a>
        </div> */}
          <div className="authmethod github">
            <a href="http://localhost:3500/auth/github">
              <button className="authmethod-btn github">
                <img src={github} className="authicon" alt="" /> Authenticate
                using GitHub
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
