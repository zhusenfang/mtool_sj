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
    DeviceEventEmitter
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import MyMap from '../../nativeModuals/MyMap'
import TongXuView from '../../nativeModuals/TongXuView'
import Contants from '../../../common/Contants'
var TimerMixin = require('react-timer-mixin');
export default class CeShiView extends Component{
    constructor(props){
        super(props)
        this.state={
            message:'',
            cell:0
        }
        mixins: [TimerMixin]
    }
    componentDidMount() {
        DeviceEventEmitter.addListener('action',this.onResult)
        // MyMap.toMapActivity();

    }
    onResult=(e)=>{
        // alert(e)

        if(e==='TO_CHATVIEW'){
            this.props.navigation.navigate('ChatViews')
        }else if(e==='REFRESH'){
            this.setState({
                message:e
            })
        }

        // this.forceUpdate()
    }
    componentWillUnmount(){
        DeviceEventEmitter.addListener('action',this.onResult).remove()
    }

    render(){
        // alert(this.state.message)
        return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
            <View style={{width:Contants.Screen.width,height:Contants.Screen.height-60-StatusBar.currentHeight}}>
                <TongXuView style={{width:Contants.Screen.width,height:Contants.Screen.height}}/>
            </View>
        </View>)
    }
}