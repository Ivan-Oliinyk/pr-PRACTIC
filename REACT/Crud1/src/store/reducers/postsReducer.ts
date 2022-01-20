import data from '../../data-posts.json'
import {PostsActions, PostsActionTypes, TPost, TPostsArr} from "../../types/posts";
import {UsersActionTypes} from "../../types/users";

function prepareData(): TPost[] {
    return data.map(({_id, title, body, author_id}) => {
        return {
            _id: _id.toString(),
            title,
            body,
            author_id: author_id.toString()
        }
    })
}

const initialState: TPostsArr = {
    posts: prepareData()
}

export const postsReducer = (state = initialState, action: PostsActions): TPostsArr => {
    switch (action.type) {
        case PostsActionTypes.GET_POSTS:
            return state
        case PostsActionTypes.DEL_POST:
            const data = state.posts.filter(exItem => exItem._id !== action.payload)
            return {...state, posts: data}
        case PostsActionTypes.ADD_POST:
            return {...state, posts: [...state.posts, action.payload]}
        case PostsActionTypes.EDIT_POST:
            const items = state.posts.map(oldItem => oldItem._id === action.payload._id ? action.payload : oldItem)
            return {...state, posts: items}
        default:
            return state
    }
}