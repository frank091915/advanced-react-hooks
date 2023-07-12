// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  console.log(action)
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useSafeDispatch(dispatch) {
  const unmounted = React.useRef(false)
  React.useLayoutEffect(() => {
    return () => {
      unmounted.current = true
    }
  }, [])
  return React.useCallback(
    action => {
      console.log(unmounted)
      if (!unmounted.current) dispatch(action)
    },
    [dispatch],
  )
}

function useAsync(reducer, {initialState}) {
  // initiate reducer
  const [state, dispatch] = React.useReducer(reducer, {
    status: 'idle',
    data: null,
    ...initialState,
  })
  const safeDispatch = useSafeDispatch(dispatch)

  const run = React.useCallback(
    promise => {
      if (!promise) return
      safeDispatch({type: 'pending'})
      promise.then(
        data => safeDispatch({data, type: 'resolved'}),
        error => {
          safeDispatch({error, type: 'rejected'})
        },
      )
    },
    [safeDispatch],
  )

  // provide the state
  return [{...state, run}]
}

function PokemonInfo({pokemonName}) {
  const initialState = {
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  }
  const [state] = useAsync(asyncReducer, {
    initialState,
  })
  const {data, status, error, run} = state

  React.useEffect(() => {
    if (pokemonName) run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={data} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
