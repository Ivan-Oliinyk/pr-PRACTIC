export enum UsersActionTypes {
    GET_USERS = "GET_USERS",
    DEL_USER = "DEL_USER",
    ADD_USER = "ADD_USER",
    EDIT_USER = "EDIT_USER",
}

export type TUser = {
    _id: string
    name: string
    email: string
    skills: string[]
}

export type TUsersArr = {
    users: TUser[]
}

export type TGetUsersAction = {
    type: UsersActionTypes.GET_USERS
}

export type TDelUserAction = {
    type: UsersActionTypes.DEL_USER,
    payload: string
}

export type TAddUserAction = {
    type: UsersActionTypes.ADD_USER,
    payload: TUser
}

export type TEditUserAction = {
    type: UsersActionTypes.EDIT_USER,
    payload: TUser
}

export type UsersActions = TGetUsersAction | TDelUserAction | TAddUserAction | TEditUserAction