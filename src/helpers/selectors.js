export function getAppointmentsForDay(state, day) {
  const appointments = [];
  // eslint-disable-next-line
  state.days.filter(days => {
    if (days.name === day) {
      for (const appointment of days.appointments) {
        appointments.push(state.appointments[appointment])
      }
    }
  })
  return appointments;
}

export function getInterview(state, interview) {
  if (interview) {
    return {...interview, interviewer: state.interviewers[interview.interviewer]};
  } 
  return null;
}

export function getInterviewersForDay(state, day) {
  const interviewers = [];
  // eslint-disable-next-line
  state.days.filter(days => {
    if (days.name === day) {
      for (const interviewer of days.interviewers) {
        interviewers.push(state.interviewers[interviewer])
      }
    }
  })
  return interviewers;
}