import React from 'react';

import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

import useVisualMode from '../../hooks/useVisualMode';

import './styles.scss';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFRIM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }

    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(err => transition(ERROR_SAVE, true));
  }

  function confirmCancel() {
    transition(CONFIRM);
  }

  function cancelInterview() {
    transition(DELETING, true);
    props.onCancel(props.id)
    .then(() => {
      transition(EMPTY);
    })
    .catch(err => transition(ERROR_DELETE, true));
  }

  function editInterview(id) {
    transition(EDIT);
  }

  return (
    <article className="appointment" data-testid="appointment" >
      <Header time={props.time} />
      { mode === EMPTY && <Empty onAdd={() => transition(CREATE)} /> }
      { mode === SAVING && <Status message="Saving" /> }
      { mode === CONFIRM && <Confirm onConfirm={cancelInterview} onCancel={event => (transition(back))} /> }
      { mode === DELETING && <Status message="Deleting" /> }
      { mode === ERROR_DELETE && <Error message="Error deleting" onClose={event => (transition(back))} /> }
      { mode === ERROR_SAVE && <Error message="Error saving" onClose={event => (transition(back))} /> }
      { mode === EDIT && (
        <Form 
          name={props.interview.student} 
          interviewers={props.interviewers} 
          onCancel={event => (transition(back))}
          interviewer={props.interview.interviewer.id}
          onSave={save}
        /> 
      ) }
      { mode === SHOW && (
        <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={event => editInterview(props.id)}
        onCancel={confirmCancel}
        />
        ) }
      { mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back(EMPTY)} onSave={save} />}
    </article>
  );
}
