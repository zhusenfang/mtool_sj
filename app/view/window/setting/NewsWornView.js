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
    ScrollView,
    Platform,
    Switch,
    DeviceEventEmitter,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
import LoginModule from '../../nativeModuals/LoginModule'
export default class NewsWornView extends Component{
    constructor(props){
        super(props)
        this.state={
            falseSwitchIsOn:false,
            newsworn:false,
            shenyin:false,
            zhendong:false
        }
    }
    componentDidMount() {
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
       LoginModule.initNotificationSetting()
        this.subscription=  DeviceEventEmitter.addListener('event',this.onResult)
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        this.subscription.remove()
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }
    onResult=(e)=>{
     if(e.action==='set_silent_mode'){
         if(e.enable==true){
             this.setState({
                 falseSwitchIsOn:true
             })
         }else {
             this.setState({
                 falseSwitchIsOn:false
             })
         }
     }else  if(e.action==='set_rec_new_msg'){
          if(e.enable==true){
              this.setState({
                  newsworn:true
              })
          }else {
              this.setState({
                  newsworn:false
              })
          }
     }else if(e.action==='set_msg_voice'){
         if(e.enable==true){
            this.setState({
                shenyin:true
            })
         }else {
             this.setState({
                 shenyin:false
             })
         }
     }else if(e.action==='set_msg_vibrate'){
         if(e.enable==true){
             this.setState({
                 zhendong:true
             })
         }else {
             this.setState({
                 zhendong:false
             })
         }
     }
    }

    render(){

        return(<View style={comstyle.con}>
            <View style={[comstyle.item,{marginTop:20}]}>
                <Text style={styles.jinzhi}>勿扰模式</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({falseSwitchIsOn:value})
                        if(this.state.falseSwitchIsOn==false){
                           LoginModule.silentMode(true)
                        }else {
                           LoginModule.silentMode(false)
                        }
                    }}
                    value={this.state.falseSwitchIsOn}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>
            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>接收新消息通知</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({newsworn:value})
                        if(this.state.newsworn==false){
                           LoginModule.recNewMsg(true)
                        }else {
                            LoginModule.recNewMsg(false)
                        }
                    }}
                    value={this.state.newsworn}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>

            {this.state.newsworn==true?
                <View>
            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>声  音</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({shenyin:value})
                        if(this.state.shenyin==false){
                           LoginModule.notifySound(true)
                        }else {
                           LoginModule.notifySound(false)
                        }
                    }}
                    value={this.state.shenyin}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>
            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>震动</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({zhendong:value})
                        if(this.state.zhendong==false){
                           LoginModule.notifyVibrate(true)
                        }else {
                            LoginModule.notifyVibrate(false)
                        }
                    }}
                    value={this.state.zhendong}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
              <View style={comstyle.heng}/></View>
                :<View/>}
        </View>)
    }

}
const styles=StyleSheet.create({
    jinzhi:{
        fontSize:14,
        color:'#282828',
        marginLeft:20
    },
    qing:{
        fontSize:14,
        color:'#B2B2B2',
        marginLeft:20
    },
    dongta:{
        fontSize:14,
        color:'#282828',
        marginTop:27,
        marginBottom:15,
        marginLeft:21
    }
})