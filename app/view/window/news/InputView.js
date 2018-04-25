import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView,
    AppState,
    ScrollView,
    Button,
    requireNativeComponent,
    NativeModules,
    findNodeHandle
} from 'react-native';
const Input=requireNativeComponent('InputView',InputView)

export default class InputView extends Component{
    render(){
        return(<Input
            style={{flex:1}}
        />)
    }
    initInputView(){
        NativeModules.ChatModule.initInputView(findNodeHandle(this))
    }

}