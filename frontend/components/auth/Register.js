import React, { Component } from 'react'
import {View, Button, TextInput} from 'react-native'

import firebase from 'firebase'
import 'firebase/firestore'

export default class Register extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            name: '',
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    async onSignUp(){
        const { email, password, name } = this.state
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
            firebase.firestore().collection("users").doc(email).set({
                name,
                email
            })
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder='Name'
                    onChangeText={(name) => this.setState({ name })}
                />
                <TextInput 
                    placeholder='Email'
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                <Button 
                    onPress={() => this.onSignUp()}
                    title='Sign Up'
                />
            </View>
        )
    }
}
