export enum PostsActionTypes {
    GET_POSTS = "GET_POSTS",
    DEL_POST = "DEL_POST",
    ADD_POST = "ADD_POST",
    EDIT_POST = "EDIT_POST"
}

export type TPost = {
    _id: string
    title: string
    body: string
    author_id: string
}

export type TPostsArr = {
    posts: TPost[]
}

export type TGetPostsAction = {
    type: PostsActionTypes.GET_POSTS
}

export type TDelPostAction = {
    type: PostsActionTypes.DEL_POST,
    payload: string
}

export type TAddPostAction = {
    type: PostsActionTypes.ADD_POST,
    payload: TPost
}

export type TEditPostAction = {
    type: PostsActionTypes.EDIT_POST,
    payload: TPost
}

export type PostsActions = TGetPostsAction | TDelPostAction | TAddPostAction | TEditPostAction