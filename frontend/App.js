import React, { Component } from 'react';

import {View, Text} from 'react-native'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/main/Add'
import Save from './components/main/Save'
import Comments from './components/main/Comments'

const firebaseConfig = {
  apiKey: "AIzaSyBVqkbhG-l3ERTDRssiDOce_hUwj0vOf50",
  authDomain: "instagram-dev-644cf.firebaseapp.com",
  projectId: "instagram-dev-644cf",
  storageBucket: "instagram-dev-644cf.appspot.com",
  messagingSenderId: "134754005673",
  appId: "1:134754005673:web:5fc845123d8a4e6e372fb8",
  measurementId: "G-F7SS5HDWL4"
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loaded: false
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  
  render() {
    const {loggedIn, loaded} = this.state
    if(!loaded){
      return(
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName='landing'>
            <Stack.Screen name='Landing' component={Landing} options={{headerShown: false}}/>
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name='Login' component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Main'>
              <Stack.Screen name='Main' component={Main} options={{headerShown: false}} />
              <Stack.Screen name='Add' component={Add} navigation={this.props.navigation} />
              <Stack.Screen name='Save' component={Save} navigation={this.props.navigation} />
              <Stack.Screen name='Comments' component={Comments} navigation={this.props.navigation} />
            </Stack.Navigator>
          </NavigationContainer>
      </Provider>
    )
  }
}
