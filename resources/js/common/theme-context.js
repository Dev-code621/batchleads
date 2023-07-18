import React from 'react'

const ThemeStateContext = React.createContext()
const ThemeDispatchContext = React.createContext()

function themeReducer(state, action) {
  switch (action) {
    case 'light': {
      return { theme: 'theme-light' }
    }
    case 'dark': {
      return { theme: 'theme-dark' }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function ThemeProvider({ children }) {
  const [state, dispatch] = React.useReducer(themeReducer, { theme: 'light' })
  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  )
}

function useThemeState() {
  const context = React.useContext(ThemeStateContext)
  if (context === undefined) {
    throw new Error('useThemeState must be used within a ThemeProvider')
  }
  return context
}

function useThemeDispatch() {
  const context = React.useContext(ThemeDispatchContext)
  if (context === undefined) {
    throw new Error('useThemeDispatch must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProvider, useThemeState, useThemeDispatch }
