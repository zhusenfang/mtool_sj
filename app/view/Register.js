import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,

    View,
    TextInput
} from 'react-native';
import Contants from '../common/Contants';
import GGInput from '../common/GGInput';
import {Text,Button} from 'native-base';
import Toast from "react-native-easy-toast";
import {API,postFetch,ObjectTransform} from '../common/GConst';
import Storage from '../common/GGAsyncStorage'
export default class Register extends Component{
    componentWillMount() {
        this.setState({
            verticalCode:''
        })
    }
    render(){
        return(
            <View style={styles.contain}>
                <GGInput
                    textMarginLeft={15}
                    ref={e => this._userText = e}
                    style={[styles.input,]}
                    isPwd={false}
                    leftTitle={"手机号"}
                    maxLength={11}
                    placeholder={'请输入手机号'}
                    keyboardType={"numeric"}/>
                {/*验证码输入框*/}
                <GGInput
                    maxLength={6}
                    textMarginLeft={15}
                    ref={(e) => this._captcha = e}
                    placeholder={"请输入验证码"}
                    style={[styles.input, {marginTop: 10}]}
                    isCaptcha={true}
                    leftTitle={"验证码"}
                    rightAction={this.sendCaptcha}
                    superthis={this}
                    keyboardType="numeric"
                />

                {/*密码*/}
                <GGInput
                    textMarginLeft={15}
                    ref={e => this._pwdText = e}
                    style={[styles.input, {marginTop: 10}]}
                    isPwd={true}
                    leftTitle={"密    码"}
                    placeholder={'请输入密码,不少于6位'}/>
                <Button bordered dark style={{width:Contants.Screen.width/3,marginLeft:20}}>
                    <Text onPress={this.registerAction}>确认提交</Text>
                </Button>
                {/*吐司组件*/}
                <Toast
                    ref={(e) => {
                        this._toast = e
                    }}
                    position='top'
                />

            </View>
        )
    }
    registerAction=()=>{
        //清除输入框的焦点
        this._userText._input.blur();
        this._captcha._input.blur();
        this._pwdText._input.blur();


        let toast = this._toast;

        let userPhone = this._userText.state.content;
        let captcha = this._captcha.state.content;
        let pwd = this._pwdText.state.content;

        if (!userPhone) {
            toast.show('请输入手机号');
            return;
        }

        if (!captcha) {
            toast.show('验证码不能为空');
            return;
        }

        if (!pwd) {
            toast.show('请输入密码');
            return;
        }
        //手机号验证
        var reg = /^1[34578]\d{9}$/;
        if (!reg.test(this._userText.state.content)) {
            this._toast.show('手机格式错误');
            return;
        }

        if (pwd.length < 6) {
            this._toast.show('请输入6位以上密码');
            return;
        }
          fetch("http://122.112.196.52:8080/mtool/portal/api/user/member/create",{
              method:"POST",
              headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
              body:JSON.stringify({
                   phone:userPhone,
                    password:pwd,
                      code:captcha

              })

          }).then((response)=>{

            return response.json();
          }).then((responseData)=>{
            // alert(JSON.stringify(responseData))
              if(responseData.status==0){
                this._toast.show(responseData.msg)
              }else {
                  if(responseData.status==1){
                      this._toast.show(responseData.msg)
                       Storage.save("isLogin",true);
                      // Storage.save("token",responseData.data)
                      this.timer=setTimeout(()=>{
                          this.props.navigation.navigate('Login');
                      },2000)

                  }

              }
          })
        // if (!this.state.verticalCode || captcha != this.state.verticalCode) {
        //     toast.show("验证码输入有误");
        //     return;
        // }
        var registerDate={
           phone:userPhone,
            password:pwd,
            code:captcha
        }


    }
    /**
     * 获取验证码
     */
    sendCaptcha=()=>{

        var reg = /^\d{11}$/;
        if(!reg.test(this._userText.state.content)){

            this._toast.show("手机号格式错误");

            return;
        }

       // postFetch(API.Register,null,{
       //     phone:this._userText.state.content,
       // },(result)=>{
       //     alert(JSON.stringify(result))
       // })
        fetch("http://mtool.zhaomini.com/mtool/portal/api/communication/smsverificode/registuser",{
            method:"POST",
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
            body:JSON.stringify({
                phone:this._userText.state.content,
            })
        }).then((response)=>(
            response.json()
        ).then((responseData)=>{
            alert(JSON.stringify(responseData))
            // if(responseData.status==1){
            //     // this.setState({
            //     /top/     verticalCode:responseData.
            //     // })
            // }
              if(responseData.status==0){
                  this._toast.show(responseData.msg)
              }else {
                  // this._toast.show(responseData.msg)
              }
        }).catch((error)=>{
            alert("错误了")
        }))
    }
}
const styles=StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:"#f9f9f9"
    },

    input: {
        flexDirection: "row",
        backgroundColor: "white",
    },

})