import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    StatusBar,
    DeviceEventEmitter,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import ChatView from './ChatView'
import Contants from '../../../common/Contants'
import LocationShare from '../../../view/nativeModuals/LocationShare'
import Storage from '../../../common/GGAsyncStorage'
import Contents from '../../../common/Contants'
import ComonModal from '../../CommonPage/ComonModal'
export default class LocationShareView extends Component{

    componentDidMount() {
        this.subscription=  DeviceEventEmitter.addListener('event',this.onResult)
    }
    onResult=(e)=>{
        if(e.action==='finish'){
          this.props.navigation.goBack()
        }
    }
    componentWillUnmount() {
        // DeviceEventEmitter.addListener('event',this.onResult).remove()
        //  DeviceEventEmitter.removeAllListeners()
        this.subscription.remove();
    }
    render(){
        return(<View style={comstyle.con}>
            <View style={{width:Contants.Screen.width,height:Contants.Screen.height-60-StatusBar.currentHeight}}>
                <LocationShare style={{width:Contants.Screen.width,height:Contants.Screen.height}}/>
            </View>
        </View>)
    }
}