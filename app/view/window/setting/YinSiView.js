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
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
export default class YinSiView extends Component{
    constructor(props){
        super(props)
        this.state={
            falseSwitchIsOn:false,
            fenschat:false,
            notallmo:false,
            allowStrage:false,
            together:false
        }
    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    componentDidMount() {
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
     postFetch(API.YinSiViewSettingSe,null,(result)=>{
         // alert(JSON.stringify(result))
         if(result.status===1){
             if(result.data.autoAddFans===0){
                 this.setState({
                     falseSwitchIsOn:false
                 })
             }else {
                 this.setState({
                     falseSwitchIsOn:true
                 })
             }
            if(result.data.passivityChat===0){
                 this.setState({
                     fenschat:false
                 })
            }else {
                this.setState({
                    fenschat:true
                })
            }

            if(result.data.strangerSeeStatus===0){
                this.setState({
                    notallmo:false
                })
            }else {
                this.setState({
                    notallmo:true
                })
            }

           if(result.data.fansSeeStatus===0){
                this.setState({
                    allowStrage:false
                })
           }else {
               this.setState({
                   allowStrage:true
               })
           }
           if(result.data.togetherStatus===0){
               this.setState({
                   together:false
               })
           }else {
               this.setState({
                   together:true
               })
           }

         }
     })
    }
    render(){
        return(<View style={[comstyle.con,{flexDirection:'column'}]}>
            <View style={[comstyle.item,{marginTop:20}]}>
                <Text style={styles.jinzhi}>自动关注我的粉丝</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({falseSwitchIsOn:value})
                        if(this.state.falseSwitchIsOn===false){
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{autoAddFans:1}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{autoAddFans:0}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('关闭成功')
                                }
                            })
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
                <Text style={styles.jinzhi}>允许粉丝发起聊天</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({fenschat:value})
                        if(this.state.fenschat===false){
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{passivityChat:1}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{passivityChat:0}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.fenschat}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>
            <Text style={styles.dongta}>动  态</Text>

            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>不让陌生人查看我的动态</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({notallmo:value})
                        if(this.state.notallmo===false){
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{strangerSeeStatus:1}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{strangerSeeStatus:0}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.notallmo}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>

            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>不让粉丝看我的动态</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({allowStrage:value})
                        if(this.state.allowStrage===false){
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{fansSeeStatus:1}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{fansSeeStatus:0}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.allowStrage}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>

            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>订单评价同步到动态</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({together:value})
                        if(this.state.together===false){
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{togetherStatus:1}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiViewSettingReset,{userMemberSeting:{togetherStatus:0}},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status===1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.together}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>
            <Toast ref={(e) => {
                this._toastf = e
            }}
                   position='center'
            />
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