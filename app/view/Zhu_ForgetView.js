import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
    BackHandler
} from 'react-native';
import Contants from '../common/Contants';
import GGInput from './CommonPage/Zhu_PhoneInput';
import {Button} from 'native-base';
import Toast from "react-native-easy-toast";
import Storage from '../common/GGAsyncStorage'
import {API,postFetch,ObjectTransform} from '../common/GConst'
export default class ForgetView extends Component {
 constructor(props){
     super(props)
     this.state={
         content:''
     }
 }
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
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

    render(){
        return(



            <View style={[styles.contain,{backgroundColor:'#fff'}]}>

            <Image source={require('../img/login/pwdone.png')} style={{width:Contants.Screen.width,height:70,}}/>

            <GGInput
                maxLength={6}
                textMarginLeft={15}
                ref={(e) => this._captcha = e}
                placeholder={"请输入手机号"}
                style={[styles.input, {marginTop: 10}]}
                isCaptcha={true}
                leftTitle={"商家账号"}
                rightAction={this.sendCaptcha}
                superthis={this}
                keyboardType="numeric"
            />

            <View style={{height:2, backgroundColor:'red'}}/>



            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ForgetViewTwo')}
               // this.sendCaptcha
            }
                              style={[styles.logins,{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: "center",
                                  marginTop: 20,
                                  alignSelf: 'center',
                                  height:35,
                                  width:Contants.Screen.width-40,
                                  backgroundColor:'#ff305e',
                                  borderRadius:5
                              }]}>

                <Text style={{
                    color: '#fff',
                    fontSize: 16,
                    backgroundColor: 'transparent',
                }}>下一步</Text>

            </TouchableOpacity>


            <Toast
                ref={(e) => {
                    this._toast = e
                }}
                position='center'
            />
            {/*<View style={{justifyContent:'center',alignItems:'center',marginLeft:Contants.Screen.width/2+20,marginTop:20}}>*/}
            {/*<Button bordered dark  onPress={this.sourAction}><Text>确认提交</Text></Button>*/}
            {/*</View>*/}
        </View>
        )
    }
    sendCaptcha=()=>{
        // alert('ss')
        this._captcha.blur();

        let phoneNum=this.state.content;
        // var reg = /^\d{11}$/;
        var reg = /^1[34578]\d{9}$/;
        if(!reg.test(this.state.content)){

            this._toast.show("手机号格式错误");

            return;
        }
        if(!phoneNum){
            this._toast.show("请输入手机号");
            return
        }
         postFetch(API.ForgetPwd,{phone:phoneNum},(result)=>{
            // alert(JSON.stringify(result))
             if(result.status==0){
                 this._toast.show(result.msg)
             }else {
                 if(result.status==1){
                     this._toast.show(result.msg)
                     this.props.navigation.navigate('SaFeView',{data:this.state.content})
                 }
                 //
             }
         },(error)=>{
             alert(error)
         })
    }
    // sourAction=()=>{
    //     let toast = this._toast;
    //     let phoneNum=this._captcha.state.content;
    //     let code=this._pwdText.state.content;
    //     if (!phoneNum) {
    //         toast.show('请输入手机号');
    //         return;
    //     }
    //
    //     if (!code) {
    //         toast.show('验证码不能为空');
    //         return;
    //     }
    //     //手机号验证
    //     var reg = /^1[34578]\d{9}$/;
    //     if (!reg.test(this._captcha.state.content)) {
    //         this._toast.show('手机格式错误');
    //         return;
    //     }
    //   postFetch(API.Password,{phone:phoneNum,code:code},(result)=>{
    //       alert(JSON.stringify(result))
    //       if(result.status==1){
    //           toast.show(result.msg)
    //           this.props.navigation.navigate('ResetPwd',{data:result.data});
    //       }else {
    //           toast.show(result.msg)
    //       }
    //   })
    // }
}
const styles=StyleSheet.create({
    input:{

        flexDirection:"row",
        marginLeft:10,
        marginRight:10,
        marginTop:15,
        backgroundColor:"white",

    },
    contain:{
        flex:1,
        backgroundColor:"#f9f9f9",
        flexDirection:'column',

    },
    phone:{
        fontSize:26,
        color:'#2D2D2D',
        marginTop:25,
        marginLeft:20,
        marginBottom:40,

    },
    guo:{
        flexDirection:'row',
        alignItems:'center',
    },
    text:{
       fontSize:18,
        color:'#B2B2B2',
        // marginLeft:15

    },
    zhong:{
        fontSize:18,
        color:'#2D2D2D',
        marginLeft:30
    },
    heng:{
        width:335,height:1,backgroundColor:'#E5E5E5',alignSelf:'center',
    },
    textinput:{
        height:40,

        width:Contants.Screen.width-80,
        color:'#2D2D2D',
        fontSize:18,
        marginLeft:30
    },
    img:{
        marginTop:5,
        marginLeft:Contants.Screen.width/2
    },
    zuixia:{

        justifyContent:'center',
        alignItems:'center',

    },
    fa:{
        color:'white',
        fontSize:14,

    }
})