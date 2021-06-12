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

function ViewForm() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState([]);
  const { formID } = useParams();
  const history = useHistory();
  useEffect(
    function () {
      setLoading(true);
      axios.get(`/api/form/${formID}/read`).then(({ data }) => {
        if (data.message === "success") {
          let x = setUpFormState(data.data.formData);
          if (localStorage.getItem(formID)) {
            setFormState(() => JSON.parse(localStorage.getItem(formID)));
          } else setFormState(() => x);
          setForm(() => data.data);
          setLoading(() => false);
        }
      });
    },
    [formID]
  );
  function setUpFormState(formData) {
    return formData.map(({ question, questionType, options }) => ({
      question,
      questionType,
      optionSelected:
        questionType === "radio"
          ? ""
          : [...Array(options.length)].map(() => ""),
    }));
  }
  function handleChange(e, gindex, index) {
    if (e.target.type === "radio") {
      setFormState((prevState) => {
        prevState[gindex].optionSelected = e.target.value;
        localStorage.setItem(formID, JSON.stringify(prevState));
        return [...prevState];
      });
    } else {
      setFormState((prevState) => {
        let x = prevState.map((question, ind) => {
          if (gindex !== ind) return question;
          return {
            ...question,
            optionSelected: question.optionSelected.map((option, index1) => {
              if (index !== index1) return option;
              return option === e.target.value ? "" : e.target.value;
            }),
          };
        });
        localStorage.setItem(formID, JSON.stringify(x));
        return x;
      });
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios.post(`/api/form/${formID}/record`, formState).then(({ data }) => {
      if (data.message === "success") {
        localStorage.removeItem(formID);
        setFormState(() => setUpFormState(form.formData));
        history.push(`/form/${formID}/submitted`);
      }
    });
  }
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>{form.title}</h1>
      <div>
        <form
          action={`/api/form/${formID}/record`}
          method="POST"
          onSubmit={handleSubmit}
        >
          {form.formData.map(
            ({ question, questionType, _id, options }, gindex) => (
              <div key={_id}>
                <div>{question}</div>
                <div>
                  {options.map((option, index) => (
                    <div key={index}>
                      <input
                        type={questionType}
                        name={question}
                        id={`option${gindex}${index}`}
                        value={option}
                        checked={
                          questionType === "radio"
                            ? option === formState[gindex].optionSelected
                            : formState[gindex].optionSelected[index] === option
                        }
                        required={questionType === "radio"}
                        onChange={(e) => handleChange(e, gindex, index)}
                      />
                      <label htmlFor={`option${gindex}${index}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
          <input type="submit" />
        </form>
      </div>
    </div>
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
          options: [...x.options],
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
        .post(`/api/form/${formID}/edit`, {title: title, formData: state})
        .then(({ data }) => {
          if (data.message === "success") {
            history.push(`/form/${formID}/view`)
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
      {/* <div>{JSON.stringify(state)}</div> */}
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
                <option value="checkbox">checkbox</option>
                <option value="radio">radio</option>
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
                {options.map((option, oindex) => (
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
                ))}
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

function ResponseForm() {
  const [responses, setResponses] = useState([]);
  const [title, setTitle] = useState("");
  const { formID } = useParams();
  useEffect(
    function () {
      axios
        .get(`/api/form/${formID}/responses`)
        .then(({ data }) => {
          if (data.message === "success") {
            setResponses(() => data.data.formResponse);
            setTitle(()=> data.data.title);
          }
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    [formID]
  );
  if (responses.length === 0)
    return (
      <div>
        <h1>Form Response {formID}</h1>
        <div>No responses yet</div>
      </div>
    );
  return (
    <div>
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
