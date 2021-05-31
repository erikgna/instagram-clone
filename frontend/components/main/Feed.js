import React, { useState, useEffect } from 'react'
import {StyleSheet, View, Text, Image, FlatList, Button} from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){
            props.feed.sort(function(x,y){
                return x.creation - y.creation
            })

            setPosts(props.feed)
        }

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (email, postId) => {
        firebase.firestore()
        .collection('posts')
        .doc(email)
        .collection('userPosts')
        .doc(postId)
        .collection('likes')
        .doc(firebase.auth().currentUser.email)
        .set({})
    }

    const onDislikePress = (email, postId) => {
        firebase.firestore()
        .collection('posts')
        .doc(email)
        .collection('userPosts')
        .doc(postId)
        .collection('likes')
        .doc(firebase.auth().currentUser.email)
        .delete()
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList 
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                            {item.currentUserLike ? 
                                (
                                    <Button title='Dislike' onPress={() => onDislikePress(item.user.email, item.id)} />
                                ) :
                                (
                                    <Button title='Like' onPress={() => onLikePress(item.user.email, item.id)} />
                                )
                            }
                            <Text 
                                onPress={() => props.navigation.navigate('Comment', {postId: item.id, email: item.user.email})}>
                                    View Comments...
                            </Text>
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

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed)