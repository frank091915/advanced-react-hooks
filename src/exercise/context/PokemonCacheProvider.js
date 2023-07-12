import * as React from 'react'

const PokemonCacheContext = React.createContext()

// the first arg is the current state
// the next is user's action
export function pokemonReducer(state, action) {
  const {type, pokemonName, pokemonData} = action
  switch (type) {
    case 'ADD_POKEMON':
      return {
        ...state,
        [pokemonName]: pokemonData,
      }
    default:
      break
  }
}

export function PokemonCacheProvider(props) {
  const [cache, dispatch] = React.useReducer(pokemonReducer, {})
  const value = [cache, dispatch]
  return <PokemonCacheContext.Provider value={value} {...props} />
}

export function usePokemonCache() {
  const context = React.useContext(PokemonCacheContext)
  console.log('usePokemonCache', context)
  if (!context) {
    throw Error(`PokemonCacheContext must be used in PokemonCacheProvider`)
  }
  return context
}
