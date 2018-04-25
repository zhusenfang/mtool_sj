import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    Image,
    Platform,
    BackHandler
} from 'react-native';
import Contants from '../common/Contants';
import GGInput from './CommonPage/PhoneInput';
import {Text,Button} from 'native-base';
import Toast from "react-native-easy-toast";
import Storage from '../common/GGAsyncStorage'
import {API,postFetch,ObjectTransform} from '../common/GConst'
export default class ResetPwd extends Component {
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
           let data=this.props.navigation.state.params.data
           return(
               <View style={styles.contain}>
                   <GGInput
                       textMarginLeft={15}
                       ref={e => this._pwdText = e}
                       style={[styles.input, {marginTop: 30}]}
                       isPwd={true}
                       leftTitle={"登录密码"}
                       placeholder={'输入密码'}/>
                   <View style={styles.hengx}/>
                   <GGInput
                       textMarginLeft={15}
                       ref={e => this._pwdTextsec= e}
                       style={[styles.input, {marginTop: 10}]}
                       isPwd={true}
                       leftTitle={"再次确认"}
                       placeholder={'输入密码'}/>
                   <View style={styles.hengx}/>
                   {/*<View style={{justifyContent:'center',alignItems:'center',marginLeft:Contants.Screen.width/2+20,marginTop:20}}>*/}
                       {/*<Button bordered dark  onPress={this.sourAction}><Text>确认提交</Text></Button>*/}
                   {/*</View>*/}
                   <TouchableOpacity style={[styles.zuixia,{marginTop:50,}]} onPress={this.sourAction}>
                       <Image source={require('../img/shezhi/chongzhi.png')} style={styles.zuixia}>
                           <Text style={styles.fa}>确认提交</Text>
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
        let data=this.props.navigation.state.params.data
           let pwd=this._pwdText.state.content;
           let pwdsc=this._pwdTextsec.state.content;
        if(!pwd){
            this._toast.show("请输入密码");
            return
        }
        if(!pwdsc){
            this._toast.show("请输入密码");
            return
        }
      postFetch(API.ResetPwd,{id:data,newPassword:pwdsc},(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
              this.props.navigation.navigate('Login')
          }else {
              this._toast.show(result.msg)
          }
      },(error)=>{
          alert(error)
      })
    }
}
const styles=StyleSheet.create({
    input:{

        flexDirection:"row",
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        // backgroundColor:"white",
    },
    contain:{
        flex:1,
        backgroundColor:"#f9f9f9"
    },
    hengx:{
        width:335,height:1,backgroundColor:'#FFFFFF',alignSelf:'center'
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