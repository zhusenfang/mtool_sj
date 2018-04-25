import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
    BackHandler,
    Platform
} from 'react-native';
import Contants from '../../../common/Contants';
import GGInput from '../../CommonPage/PhoneInput';
import {Button} from 'native-base';
import Toast from "react-native-easy-toast";
import Storage from '../../../common/GGAsyncStorage'
import {API,postFetch,ObjectTransform} from '../../../common/GConst'
export default class AccountYanZheng extends Component {
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
        const list=this.props.navigation.state.params.data;
        return(<View style={styles.contain}>

            <Text style={styles.phone}>输入手机号码</Text>
            <View style={styles.guo}>
                <Text style={[styles.text,{marginLeft:15}]}>国家/地区</Text>
                <Text style={styles.zhong}>中国</Text>
                <Image source={require('../../../img/shezhi/jian.png')} style={styles.img}/>
            </View>
            <View style={[styles.heng,{marginTop:10}]}/>

            <View style={styles.guo}>
                <Text style={[styles.text,{marginLeft:55,alignSelf:'center',}]}>+86</Text>

                <Text style={styles.textinput}>{list}</Text>
            </View>
            <View style={styles.heng}/>
            <TouchableOpacity style={[styles.zuixia,{marginTop:50,}]} onPress={this.sendCaptcha}>
                <Image source={require('../../../img/shezhi/chongzhi.png')} style={styles.zuixia}>
                    <Text style={styles.fa}>发送短信</Text>
                </Image>
            </TouchableOpacity>

            <Toast
                ref={(e) => {
                    this._toast = e
                }}
                position='center'
            />

        </View>)
    }
    sendCaptcha=()=>{
        // alert('ss')
        // this._captcha.blur();
        const list=this.props.navigation.state.params.data;
        let phoneNum=this.state.content;
        // var reg = /^\d{11}$/;
        var reg = /^1[34578]\d{9}$/;
        if(!reg.test(list)){

            this._toast.show("手机号格式错误");

            return;
        }
        if(!list){
            this._toast.show("请输入手机号");
            return
        }
        postFetch(API.ForgetPwd,{phone:list},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==0){
                this._toast.show(result.msg)
            }else {
                if(result.status==1){
                    this._toast.show(result.msg)
                    this.props.navigation.navigate('AccountMessage',{data:list})
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
        marginLeft:15,
        marginRight:15,
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
        marginLeft:30,
        marginTop:15
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
        backgroundColor:'transparent',
    }
})