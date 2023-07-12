import * as React from 'react'

export const CountContext = React.createContext()

export function CountProvider(props) {
  const [count, setCount] = React.useState(0)
  const value = [count, setCount]
  return (
    <CountContext.Provider value={value} {...props}></CountContext.Provider>
  )
}

export function useCount() {
  const context = React.useContext(CountContext)
  if (!context) {
    throw Error(`CountProvider must be used in the Provider`)
  }
  return context
}
