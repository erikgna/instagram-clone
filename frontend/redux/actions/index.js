import {USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA} from '../constants/index'
import firebase from 'firebase'

export function clearData(){
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return((dispatch) => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.email)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                } else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts(){
    return((dispatch) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.email)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return{id, ...data}
                })
                dispatch({type: USER_POSTS_STATE_CHANGE, posts})
            })
    })
}

export function fetchUserFollowing(){
    return((dispatch) => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.email)
            .collection('userFollowing')
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id
                    return id
                })
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following})
                for(let i = 0; i < following.length; i++){
                    dispatch(fetchUsersData(following[i], true))
                }
            })
    })
}

export function fetchUsersData(email, getPosts){
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.email === email)

        if(!found){
            firebase.firestore()
            .collection('users')
            .doc(email)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data()
                    user.email = snapshot.email

                    dispatch({type: USERS_DATA_STATE_CHANGE, user})
                } else {
                    console.log('does not exist')
                }
            })
            if(getPosts){
                dispatch(fetchUsersFollowingPosts(email))
            }
        }
    })
}

export function fetchUsersFollowingPosts(email){
    return((dispatch) => {
        firebase.firestore()
            .collection('posts')
            .doc(email)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {

                const email = snapshot.query.EP.path.segments[1]
                const user = getState().usersState.users.find(el => el.email === email)

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return{id, ...data, user}
                })
                for(let i = 0; i < posts.length; i++){
                    dispatch(fetchUsersFollowingLikes(email, posts[i].id))
                }
                dispatch({type: USERS_POSTS_STATE_CHANGE, posts, email})
            })
    })
}

export function fetchUsersFollowingLikes(email, postId){
    return((dispatch) => {
        firebase.firestore()
            .collection('posts')
            .doc(email)
            .collection('userPosts')
            .doc(postId)
            .collection('likes')
            .doc(firebase.auth().currentUser.email)
            .onSnapshot((snapshot) => {
                const postId = snapshot.ZE.path.segments[3]

                let currentUserLike = false
                if(snapshot.exists){
                    currentUserLike = true
                }

                dispatch({type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike})
            })
    })
}