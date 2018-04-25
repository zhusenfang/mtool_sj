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
import GGInput from './CommonPage/PhoneInput';
import {Button} from 'native-base';
import Toast from "react-native-easy-toast";
import Storage from '../common/GGAsyncStorage'
import {API,postFetch,ObjectTransform} from '../common/GConst'
var TimerMixin = require('react-timer-mixin');
export default class SaFeView extends Component {
    mixins: [TimerMixin]
    constructor(props){
        super(props);
       this.state={
           content:'',
           //倒计时
           countdown:60,
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

    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
        this.timer =setInterval(()=>{

            if(this.state.countdown <= 0){

                this.timer && clearInterval(this.timer);
                this.setState({

                    countdown:60,
                    // disabled:false,
                })
            }

            this.setState({

                countdown:this.state.countdown-1,
            });

        },1000);

    }
    render(){
        const list=this.props.navigation.state.params.data;
        return(
            <View style={styles.contain}>
            <Text style={styles.phone}>输入短信验证码</Text>
            <View style={styles.col}>
            <Text style={styles.con}>我们已经给手机号码</Text>
                <Text style={styles.textcl}>{"+86"+list}</Text>
                <Text style={styles.con}>发送了一个6位数验证码</Text>
            </View>

            <TextInput
                underlineColorAndroid="transparent"
                style={styles.textinput}
                ref={(e) => this._captcha = e}
                onChangeText={(e)=>{
                    this.setState({
                        content:e,
                    })
                }}
            />

            <View style={{flexDirection:'row'}}>
              <View style={styles.xu}/>
                <View style={styles.xu}/>
                <View style={styles.xu}/>
                <View style={styles.xu}/>
                <View style={styles.xu}/>
                <View style={styles.xu}/>
            </View>

            <View style={styles.re}>
                <View style={styles.heng}>
              <Text style={styles.chong}>重新发送</Text>
                    <View style={styles.xia}/>
                </View>
                <Text style={styles.chong}>{'('+this.state.countdown+')'}</Text>
            </View>

            <TouchableOpacity style={[styles.zuixia,{marginTop:50,}]} onPress={this.sourAction}>
                <Image source={require('../img/shezhi/chongzhi.png')} style={styles.zuixia}>
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
    sourAction=()=>{
        const list=this.props.navigation.state.params.data;
        let toast = this._toast;
        // let phoneNum=this._captcha.state.content;
        let code=this.state.content;
        // if (!code) {
        //     toast.show('请输入手机号');
        //     return;
        // }

        if (!code) {
            toast.show('验证码不能为空');
            return;
        }

        postFetch(API.Password,{phone:list,code:code},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                toast.show(result.msg)
                this.props.navigation.navigate('ResetPwd',{data:result.data});
            }else {
                toast.show(result.msg)
            }
        })
    }
}
const styles=StyleSheet.create({
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
    con:{
     fontSize:14,
     color:'#2D2D2D',

    },
    col:{
        flexDirection:'row',
        marginLeft:20,
        marginRight:20,
        flexWrap:'wrap',
    },
    textcl:{
        fontSize:14,
        color:'#FF305E'
    },
    textinput:{
        width:335,
        height:40,
        marginLeft:20

    },
    re:{
        flexDirection:'row',
          marginTop:20
    },
    xu:{
        height:1,
        width:40,
        marginLeft:20,
        backgroundColor:'#E5E5E5'
    },
    heng:{
        flexDirection:'column',

    },
    xia:{
        width:57,
        height:1,
        backgroundColor:'#B2B2B2',
        marginLeft:20
    },
    chong:{
        marginLeft:20,
        fontSize:14,
        color:'#B2B2B2'
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