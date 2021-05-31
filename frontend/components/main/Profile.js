import React, { useState, useEffect } from 'react'
import {StyleSheet, View, Text, Image, FlatList, Button} from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

function Profile(props) {
    const [userPost, setUserPost] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const {currentUser, posts} = props

        if(props.route.params.email === firebase.auth().currentUser.email){
            setUser(currentUser)
            setUserPost(posts)
        } else {
            firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.email)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data())
                } else {
                    console.log('does not exist')
                }
            })
            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.email)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return{id, ...data}
                })
                setUserPost(posts)
            })
        }

        if(props.following.indexOf(props.route.params.email) > -1){
            setFollowing(true)
        } else{
            setFollowing(false)
        }

    }, [props.route.params.email, props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.email)
            .collection('userFollowing')
            .doc(props.route.params.email)
            .set({})
    }

    const onUnfollow = () => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.email)
            .collection('userFollowing')
            .doc(props.route.params.email)
            .delete({})
    }

    const onLogout = () => {
        firebase.auth().signOut()
    }

    if(user === null){
        return <View />
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {props.route.params.email !== firebase.auth().currentUser.email ? (
                    <View>
                        {following? (
                            <Button
                                title='Following'
                                onPress={() => onUnfollow()}
                            />
                        ) : (
                            <Button
                                title='Follow'
                                onPress={() => onFollow()}
                            />
                        )}
                    </View>
                ) :  <Button
                        title='Logout'
                        onPress={() => onLogout()}
                    />}
            </View>
            <View style={styles.containerGallery}>
                <FlatList 
                    numColumns={3}
                    horizontal={false}
                    data={userPost}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20,
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        width: '100%',
        height: 100,
        flex: 1,
        aspectRatio: 1/1
    }
})

const mapStateToProps  = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile)