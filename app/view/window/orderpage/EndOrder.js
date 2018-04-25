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
    AppState
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import EndOrderFirst from './EndOrderFirst'
import EndOrderSecond from './EndOrderSecond'
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import MyTimer from '../../../common/MyTimer'
var TimerMixin=require('react-timer-mixin');
var navigation=null
export default class EndOrder extends Component {
    constructor(props){
        super(props);
        navigation=this.props.navigation
    }
    render(){
        return(<View style={{flex:1,marginTop:20,backgroundColor:'#f9f9f9'}}>
            <Tabs
                initialPage={0}

                tabBarUnderlineStyle={{backgroundColor:"blue",justifyContent:"center"}}

            >
                <Tab
                    heading={"外送订单"}
                    activeTextStyle={{color:"#000000"}}
                    textStyle={{color:"#000000"}}
                    tabStyle={{backgroundColor:"white"}}
                    activeTabStyle={{backgroundColor:"white"}}

                >
                    <EndOrderFirst navigation={navigation}/>

                </Tab>

                <Tab heading={"到店订单"}
                     activeTextStyle={{color:"#000000"}}
                     textStyle={{color:"#000000"}}
                     tabStyle={{backgroundColor:"white"}}
                     activeTabStyle={{backgroundColor:"white"}}

                >
                    <EndOrderSecond navigation={navigation}/>

                </Tab>
            </Tabs>
        </View>)
    }
}