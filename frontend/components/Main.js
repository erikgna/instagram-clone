import React, { Component } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUser, fetchUserPosts, fetchUserFollowing, clearData} from '../redux/actions/index'

import Feed from './main/Feed'
import Profile from './main/Profile'
import Search from './main/Search'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {
    componentDidMount(){
        this.props.clearData()
        this.props.fetchUser()
        this.props.fetchUserPosts()
        this.props.fetchUserFollowing()
    }    

    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={Feed} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='home' color={color} size={26} />
                    )
                }} />
                <Tab.Screen name="Search" component={Search} navigation={this.props.navigation} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='magnify' color={color} size={26} />
                    )
                }} />
                <Tab.Screen name="AddContainer" component={EmptyScreen} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='plus-box' color={color} size={26} />
                    )
                    }}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault()
                            navigation.navigate('Add')
                        }
                    })}
                />
                <Tab.Screen name="Profile" component={Profile} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='account-circle' color={color} size={26} />
                    )
                    }} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault()
                            navigation.navigate('Profile', {email: firebase.auth().currentUser.email})
                        }
                    })}
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing, clearData}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
