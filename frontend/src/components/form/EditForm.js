import axios from "axios";
import { useState, useEffect, useReducer, useRef, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./EditForm.css";
import user from "../../assets/user.svg";
import plus from "../../assets/plus.svg";
import cancel from "../../assets/cancel.svg";

const ACTIONS = {
  INIT: "initializeForm",
  EDIT_TITLE: "editTitle",
  CREATE_QUESTION: "createQuestion",
  DELETE_QUESTION: "deleteQuestion",
  EDIT_QUESTION: "editQuestion",
  CHANGE_QUESTION_TYPE: "changeQuestionType",
  ADD_OPTION: "addOption",
  DELETE_OPTION: "deleteOption",
  EDIT_OPTION: "editOption",
};

function reducer(state, action) {
  let x, y, z;
  switch (action.type) {
    case ACTIONS.INIT:
      return action.payload;
    case ACTIONS.CREATE_QUESTION:
      return [
        ...state,
        {
          question: `New question ${state.length + 1}`,
          questionType: "radio",
          options: ["option 1", "option 2"],
        },
      ];
    case ACTIONS.DELETE_QUESTION:
      if (state.length === 1) return state;
      return [
        ...state.slice(0, action.payload.questionIndex),
        ...state.slice(action.payload.questionIndex + 1, state.length),
      ];
    case ACTIONS.EDIT_QUESTION:
      x = { ...state[action.payload.questionIndex] };
      return [
        ...state.slice(0, action.payload.questionIndex),
        {
          question: action.payload.to,
          options: [...x.options],
          questionType: x.questionType,
        },
        ...state.slice(action.payload.questionIndex + 1, state.length),
      ];
    case ACTIONS.CHANGE_QUESTION_TYPE:
      x = { ...state[action.payload.questionIndex] };
      return [
        ...state.slice(0, action.payload.questionIndex),
        {
          question: x.question,
          options:
            action.payload.to === "text"
              ? ""
              : x.options === ""
              ? ["option 1", "option 2"]
              : [...x.options],
          questionType: action.payload.to,
        },
        ...state.slice(action.payload.questionIndex + 1, state.length),
      ];
    case ACTIONS.ADD_OPTION:
      x = { ...state[action.payload.questionIndex] };
      y = [...x.options].concat(`option ${x.options.length + 1}`);
      return [
        ...state.slice(0, action.payload.questionIndex),
        {
          question: x.question,
          options: y,
          questionType: x.questionType,
        },
        ...state.slice(action.payload.questionIndex + 1),
      ];
    case ACTIONS.DELETE_OPTION:
      x = { ...state[action.payload.questionIndex] };
      y = [...x.options];
      if (y.length <= 2) return state;
      z = [
        ...y.slice(0, action.payload.optionIndex),
        ...y.slice(action.payload.optionIndex + 1),
      ];
      return [
        ...state.slice(0, action.payload.questionIndex),
        {
          question: x.question,
          options: z,
          questionType: x.questionType,
        },
        ...state.slice(action.payload.questionIndex + 1),
      ];
    case ACTIONS.EDIT_OPTION:
      x = { ...state[action.payload.questionIndex] };
      y = [...x.options];
      y[action.payload.optionIndex] = action.payload.to;
      return [
        ...state.slice(0, action.payload.questionIndex),
        {
          question: x.question,
          options: y,
          questionType: x.questionType,
        },
        ...state.slice(action.payload.questionIndex + 1),
      ];
    default:
      return state;
  }
}

export default function EditForm() {
  const [state, dispatch] = useReducer(reducer, []);
  // const [form, setForm] = useState({});
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const profileModal = useRef();
  const [, toggleAuthentication] = useContext(AuthContext);
  const { formID } = useParams();
  const history = useHistory();
  useEffect(
    function () {
      setLoading(() => true);
      axios.get("/api/user/profile").then(({ data }) => {
        if (data.message === "success") {
          setProfile(data.data);
          setLoading(() => true);
        }
      });
      axios
        .get(`/api/form/${formID}/edit`)
        .then(({ data }) => {
          if (data.message === "success") {
            // setForm(() => data.data);
            setTitle(() => data.data.title);
            dispatch({ type: ACTIONS.INIT, payload: data.data.formData });
          }
        })
        .catch((error) => {
          console.log(error, "212");
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
  function handleEdit(e) {
    axios
      .post(`/api/form/${formID}/edit`, { title: title, formData: state })
      .then(({ data }) => {
        if (data.message === "success") {
          history.push(`/dashboard`);
        }
      })
      .catch((error) => {
        console.log(error, "212");
      });
  }
  function handleTitleCHange(arg) {
    setTitle(() => arg.payload.to);
  }
  if (state.length === 0 && !loading)
    return (
      <div>
        <h1>Form Edit {formID}</h1>
      </div>
    );
  return (
    loading && (
      <div className="edit-form-container">
        <nav className="navbar">
          <div className="page-name">Edit Form</div>
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
        <h1 className="edit-form-title">
          <DivTextToggler
            text={title}
            actionType={ACTIONS.EDIT_TITLE}
            dispatch={handleTitleCHange}
          />
        </h1>
        <div className="edit-form">
          {state.map(({ question, options, questionType }, index) => {
            return (
              <div key={index} className="edit-form-control">
                <div className="edit-question-type-control">
                  <select
                    name={`questionType${index}`}
                    id={`questionType${index}`}
                    onChange={(e) =>
                      dispatch({
                        type: ACTIONS.CHANGE_QUESTION_TYPE,
                        payload: { questionIndex: index, to: e.target.value },
                      })
                    }
                    value={questionType}
                  >
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                    <option value="text">Text</option>
                  </select>
                  <button
                    onClick={() =>
                      dispatch({
                        type: ACTIONS.DELETE_QUESTION,
                        payload: { questionIndex: index },
                      })
                    }
                    className="delete-icon-btn"
                  >
                    <img src={cancel} className="img-icon" alt="X" />
                  </button>
                </div>
                <DivTextToggler
                  text={question}
                  actionType={ACTIONS.EDIT_QUESTION}
                  dispatch={dispatch}
                  payload={{ questionIndex: index }}
                />
                <div>
                  {questionType === "text" ? (
                    <div>
                      <input
                        type={questionType}
                        className="edit-text"
                        disabled
                        name={question}
                      />
                    </div>
                  ) : (
                    options.map((option, oindex) => (
                      <div key={oindex} className="edit-option-container">
                        <input
                          type={questionType}
                          disabled
                          name={question}
                          value={option}
                        />
                        <DivTextToggler
                          text={option}
                          actionType={ACTIONS.EDIT_OPTION}
                          dispatch={dispatch}
                          payload={{
                            questionIndex: index,
                            optionIndex: oindex,
                          }}
                        />
                        <button
                          className="edit-delete-option"
                          onClick={(e) =>
                            dispatch({
                              type: ACTIONS.DELETE_OPTION,
                              payload: {
                                questionIndex: index,
                                optionIndex: oindex,
                              },
                            })
                          }
                        >
                          <img
                            src={cancel}
                            alt="Delete"
                            className="img-icon1"
                          />
                        </button>
                      </div>
                    ))
                  )}
                  {questionType !== "text" && (
                    <button
                      className="edit-add-option"
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.ADD_OPTION,
                          payload: { questionIndex: index },
                        })
                      }
                    >
                      <img className="img-icon1" src={plus} alt="" /> ADD OPTION
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button
            className="edit-add-question"
            onClick={() => dispatch({ type: ACTIONS.CREATE_QUESTION })}
          >
            <img src={plus} className="img-icon1" alt="" /> ADD QUESTION
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={handleEdit} className="edit-save-form">
            Save Form
          </button>
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
    )
  );
}

function DivTextToggler({ text, actionType, dispatch, payload }) {
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="edit-div-text">
      {!editMode ? (
        <span className="text-holder" onClick={() => setEditMode(true)}>
          {text}
        </span>
      ) : (
        <input
          className="edit-text"
          autoFocus
          value={text}
          onChange={(e) => {
            return dispatch({
              type: actionType,
              payload: { to: e.target.value, ...payload },
            });
          }}
          onFocus={(e) => e.target.select()}
          onBlur={() => {
            if (text === "")
              dispatch({
                type: actionType,
                payload: { to: "Keep Something", ...payload },
              });
            setEditMode(false);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter" || e.code === "Escape") e.target.blur();
          }}
        />
      )}
    </div>
  );
}
