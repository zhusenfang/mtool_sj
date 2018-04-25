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
    Button
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import SearchPage from '../../SearchPage'
import OrderPage from '../../OrderPage'
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import MyTimer from '../../../common/MyTimer'
// var TimerMixin=require('react-timer-mixin');
import Modal from 'react-native-modal'
// var comdtime=600;

export default class BeiZhu extends Component {
    render(){
        return(<View style={{flex:1}}>
            <View style={{margin:20,width:Contants.Screen.width-40,height:150,backgroundColor:'white'}}>
             <TextInput
             placeholder={'输入备注内容'}
             underlineColorAndroid='transparent'

             />
            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-end',width:Contants.Screen.width-40}}>
                <Text style={{backgroundColor:'white'}}>保存</Text>
            </View>
        </View>)
    }

}