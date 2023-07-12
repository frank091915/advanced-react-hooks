// useReducer: simple Counter
// 💯 accept the step as the action
// http://localhost:3000/isolated/final/01.extra-1.js

import * as React from 'react'

// change the state name to count , and change the count plus step
const countReducer = (count, step) => count + step

function Counter({initialCount = 0, step = 1}) {
  // change the dispatch function name to be changeCount
  const [count, changeCount] = React.useReducer(countReducer, initialCount)
  const increment = () => changeCount(step)
  return <button onClick={increment}>{count}</button>
}

function Usage() {
  return <Counter />
}

export default Usage
