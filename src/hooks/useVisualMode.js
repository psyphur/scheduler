import React, { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(second, replace = false) {
    if (replace) {
      history[history.length - 1] = mode;
      setMode(second);
    } else {
      history.push(second);
      setMode(second);
    } 
  }

  function back() {
    if(history.length > 1) {
      setMode(history[history.length - 2]);
      history.pop();
    }
  }

  return { mode, transition, back }; 
}