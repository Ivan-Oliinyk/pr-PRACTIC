import data from "../../data-users.json";
import {TUser, TUsersArr, UsersActions, UsersActionTypes} from "../../types/users";

function prepareData(): TUser[] {
    return data.map(({_id, list, email, skills}) => {
        return {
            _id: _id.toString(),
            name: list,
            email,
            skills: skills.split(', ')
        }
    })
}

const initialState: TUsersArr = {
    users: prepareData()
}

export const usersReducer = (state = initialState, action: UsersActions): TUsersArr => {
    switch (action.type) {
        case UsersActionTypes.GET_USERS:
            return state
        case UsersActionTypes.DEL_USER:
            const data = state.users.filter(exItem => exItem._id !== action.payload)
            return {...state, users: data}
        case UsersActionTypes.ADD_USER:
            return {...state, users: [...state.users, action.payload]}
        case UsersActionTypes.EDIT_USER:
            const items = state.users.map(oldItem => oldItem._id === action.payload._id ? action.payload : oldItem)
            return {...state, users: items}
        default:
            return state
    }
}