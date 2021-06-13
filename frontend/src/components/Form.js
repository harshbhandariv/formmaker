import React, { useState, useEffect, useReducer } from "react";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import axios from "axios";
import ViewForm from "./form/ViewForm";
import ResponseForm from "./form/ResponseForm";

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
    <div>
      <h1>Response Submitted</h1>
      <Link to={`/form/${formID}/view`}>Submit Another Response</Link>
    </div>
  );
}

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
          options: action.payload.to === "text" ? "" : [...x.options],
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

function EditForm() {
  const [state, dispatch] = useReducer(reducer, []);
  // const [form, setForm] = useState({});
  const [title, setTitle] = useState("");
  const { formID } = useParams();
  const history = useHistory();
  useEffect(
    function () {
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
  function handleEdit(e) {
    axios
      .post(`/api/form/${formID}/edit`, { title: title, formData: state })
      .then(({ data }) => {
        if (data.message === "success") {
          history.push(`/form/${formID}/view`);
        }
      })
      .catch((error) => {
        console.log(error, "212");
      });
  }
  function handleTitleCHange(arg) {
    setTitle(() => arg.payload.to);
  }
  return (
    <div>
      <h1>
        <DivTextToggler
          text={title}
          actionType={ACTIONS.EDIT_TITLE}
          dispatch={handleTitleCHange}
        />
      </h1>
      <div>
        {state.map(({ question, options, questionType }, index) => {
          return (
            <div key={index}>
              <DivTextToggler
                text={question}
                actionType={ACTIONS.EDIT_QUESTION}
                dispatch={dispatch}
                payload={{ questionIndex: index }}
              />
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
              >
                DELETE QUESTION
              </button>
              <div>
                {questionType === "text" ? (
                  <div>
                    <input type={questionType} disabled name={question} />
                  </div>
                ) : (
                  options.map((option, oindex) => (
                    <div key={oindex}>
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
                        payload={{ questionIndex: index, optionIndex: oindex }}
                      />
                      <button
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
                        DELETE OPTION
                      </button>
                    </div>
                  ))
                )}
                <button
                  onClick={() =>
                    dispatch({
                      type: ACTIONS.ADD_OPTION,
                      payload: { questionIndex: index },
                    })
                  }
                >
                  ADD OPTION
                </button>
              </div>
            </div>
          );
        })}
        <button onClick={() => dispatch({ type: ACTIONS.CREATE_QUESTION })}>
          ADD QUESTION
        </button>
      </div>
      <div>
        <button onClick={handleEdit}>Save Form</button>
      </div>
    </div>
  );
}

function DivTextToggler({ text, actionType, dispatch, payload }) {
  const [editMode, setEditMode] = useState(false);
  return (
    <span className="textholder">
      {!editMode ? (
        <span onClick={() => setEditMode(true)}>{text}</span>
      ) : (
        <input
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
    </span>
  );
}
