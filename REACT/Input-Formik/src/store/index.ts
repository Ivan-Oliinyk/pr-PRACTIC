import { combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { mainReducer } from './reducers/mainReducer'


const rootReducer = combineReducers({
  mainReducer
})

export const store = createStore(rootReducer, composeWithDevTools())


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch