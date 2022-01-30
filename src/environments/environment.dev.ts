export const environment = {
    production: false,
    _BASE_URL: 'http://localhost:3000/api',
    POSTS_BASE_URL: 'http://localhost:3000/api/post',
    POSTS: {
        ADD_POST: 'add',
        GET_POST: 'view',
        UPDATE_POST: 'update',
        DELETE_POST: 'delete',
        LIKE_POST: 'like',
        TIMELINE_ALL: 'timeline',
        USER_POSTS: 'all'
    },
    USER_BASE_URL: 'http://localhost:3000/api/user',
    USERS: {
        GET_USER: 'get',
        GET_USER_WITH_POSTS: 'view',
        SEARCH_USER:'search',
        UPDATE_USER: 'update',
        DELETE_USER: 'delete',
        FOLLOW_USER: 'follow',
        UNFOLLOW_USER: 'unfollow',
        SUGGESTION: 'suggestion',
        GET_FOLLOWERS: 'followers',
        GET_FOLLOWINGS: 'followings'
    },
    AUTH_BASE_URL: 'http://localhost:3000/api/auth',
    AUTH: {
        REGISTER: 'register',
        LOGIN: 'login'
    },
    IMAGES_PATH: 'http://localhost:3000/'
}