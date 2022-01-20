import {combineReducers} from 'redux'
import {usersReducer} from "./usersReducer";
import {postsReducer} from "./postsReducer";

export const rootReducer = combineReducers({
    users: usersReducer,
    posts: postsReducer
})

export type RootState = ReturnType<typeof rootReducer>