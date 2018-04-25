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
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import MyMap from '../../nativeModuals/MyMap'
import TongXuView from '../../nativeModuals/TongXuView'
import Contants from '../../../common/Contants'
var TimerMixin = require('react-timer-mixin');
export default class NewsMessage extends Component{
    constructor(props){
        super(props)
        this.state={
            message:'',
            cell:"",
            type:''
        }
        mixins: [TimerMixin]
    }

    componentDidMount() {
      this.subscription=  DeviceEventEmitter.addListener('event',this.onResult)
        // MyMap.toMapActivity();
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    onResult=(e)=>{
        // alert(e)

       // if(e.action==='TO_CHATVIEW'){
       //     this.setState({
       //         cell:e.HX_ID,
       //         type:e.chatType
       //     })
       //
       //     this.props.navigation.navigate('ChatViews',{data:e.HX_ID,type:e.chatType})
       // }else

           if(e.action==='REFRESH'){
           //  this.setState({
           //     message:e
           // })
       }else if(e.action==='TO_USER_DETAIL'){
           this.setState({
               cell:e.HX_ID
           })

       }
        // this.forceUpdate()
    }
    componentWillUnmount(){
        // DeviceEventEmitter.addListener('event',this.onResult).remove()
        // DeviceEventEmitter.removeAllListeners()
        this.subscription.remove();
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }

    render(){
        return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
            <View style={{width:Contants.Screen.width,height:Contants.Screen.height-60-StatusBar.currentHeight}}>
            <TongXuView style={{width:Contants.Screen.width,height:Contants.Screen.height}}/>
            </View>
        </View>)
    }
}