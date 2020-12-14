import React from "react";

import DayList from "./DayList";
import Appointment from "./Appointment";

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from '../helpers/selectors';
import useApplicationData from '../hooks/useApplicationData';

import "components/Application.scss";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    spotsRemaining
  } = useApplicationData();
  
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const appointmentsList = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment {...appointment} key={appointment.id} interview={interview} interviewers={dailyInterviewers} bookInterview={bookInterview} onCancel={cancelInterview} />
    );
  })

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
        { appointmentsList }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
