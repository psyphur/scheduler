import React from 'react';
import classnames from 'classnames';

import './DayListItem.scss';

export default function DayListItem(props) {

  const formatSpots = (spots) => {
    return (
      spots === 1 ? `${spots} spot remaining` :
      spots > 0 ? `${spots} spots remaining` :
      "no spots remaining"
    )
  }

  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })

  return (
    <li 
      className={dayClass}
      onClick={() => props.setDay(props.name)}
      data-testid="day"
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  )
}