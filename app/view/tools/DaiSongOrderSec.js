import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Button,
    ListView,

} from 'react-native';
import ActionButton from 'react-native-action-button';
import comstyle from '../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../common/GConst'
import MyTimer from '../../common/MyTimer'
import Contants from '../../common/Contants'
var TimerMixin=require('react-timer-mixin');
import AndroidMap from '../nativeModuals/AndroidMap'
export default class DaiSongOrderSec extends Component{
    render(){
        return(<View style={{flex:1}}>
            <Text>sss</Text>
            {/*<AndroidMap style={{width:Contants.Screen.width,height:Contants.Screen.height}} ref={component => this._MapView = component }/>*/}
        </View>)
    }

}