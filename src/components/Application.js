import React, { useState, useEffect } from "react";
import axios from "axios";

import DayList from "./DayList";
import Appointment from "./Appointment";

import { getAppointmentsForDay, getInterviewersForDay } from '../helpers/selectors';
import useVisualMode from "../hooks/useVisualMode";

import "components/Application.scss";


export default function Application(props) {
  const GET_DAYS = "http://localhost:8001/api/days";
  const GET_APPOINTMENTS = "http://localhost:8001/api/appointments";
  const GET_INTERVIEWERS = "http://localhost:8001/api/interviewers";

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })

  const setDay = day => setState({...state, day});

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  useEffect(() => {
    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { dailyAppointments.map(appointment => {
          return <Appointment key={appointment.id} {...appointment} interviewers={dailyInterviewers} />
        }) }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
