import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData(props) {
  const GET_DAYS = "http://localhost:8001/api/days";
  const GET_APPOINTMENTS = "http://localhost:8001/api/appointments";
  const GET_INTERVIEWERS = "http://localhost:8001/api/interviewers";

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })

  const setDay = day => setState({...state, day});

  useEffect(() => {
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, [])

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    const diff = !state.appointments[id].interview ? -1 : 0;
    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
    .then(() => {
      spotsRemaining(diff);
      setState({
        ...state,
        appointments
      });
    })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      spotsRemaining(1);
      setState({
        ...state,
        appointments
      })
    })
  }

  function spotsRemaining(i) {
    const selectedDay = state.days.find(day => {
      return day.name === state.day;
    })
    selectedDay.spots += i;
  }

  return { bookInterview, cancelInterview, state, setDay, spotsRemaining };
}
