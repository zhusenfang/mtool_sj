import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    ListView,
    KeyboardAvoidingView,
    TextInput,
    Animated,
    Platform,
    Easing,
    BackHandler
} from 'react-native';
import comstyle from '../../common/CommonStyle';
import {API,postFetch} from '../../common/GConst';
import Camera from 'react-native-camera'
import {QRScannerView} from 'ac-qrcode';
import dismissKeyboard from 'dismissKeyboard'
var TimerMixin = require('react-timer-mixin');
import Toast, {DURATION}  from 'react-native-easy-toast';
import Contants from '../../common/Contants';
import Modal from 'react-native-modal'
export default class ShouDongWrite extends Component{
    constructor(props){
        super(props);
        this.state={
            textinput:''
        }
    }
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }

    render(){
        return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
            <View style={styles.shi}>
             {/*<Text>识别码：</Text>*/}
                <View style={[styles.itemss]}>
                    <Text style={styles.text}>识别码：</Text>
                    <TextInput

                        style={styles.textinput}
                        placeholder={'单位：元'}
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#B2B2B2"
                        onChangeText={(e)=>{
                            this.setState({
                               textinput:e,
                            })
                        }}
                    />
                </View>
            </View>
            <TouchableOpacity style={[styles.qu,{marginTop:20}]} onPress={this.tijiao.bind(this)}>
              <Image source={require('../../img/window/tijiao.png')} style={styles.qu}>
                  <Text style={styles.tijiao}>确认提交</Text>
              </Image>
            </TouchableOpacity>
            <Toast
                ref={(e)=>{this._toast=e}}
                position='center'
            />
        </View>)
    }
    tijiao(){
        if(this.state.textinput.length==0){
            this._toast.show('请输入识别码')
            return
        }
        this.props.navigation.navigate('OrderDetail',{data:this.state.textinput})
    }
}

const styles=StyleSheet.create({
    shi:{
        height:66,
        backgroundColor:'#FFFFFF',
        alignItems:'center',
        flexDirection:'row',
        marginTop:20
    },
    itemss: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        // margin:10
    },
    textinputs:{
        width:Contants.Screen.width/2+60,
        borderWidth:1,
        borderColor:'gray',
        height:60,
        marginLeft:5,
        marginTop:10
    },
    textinput:{
        width:Contants.Screen.width/2+60,
        borderWidth:1,
        borderColor:'#E5E5E5',
        height:40,
        marginLeft:20,
        borderRadius:4
    },
    text:{
        marginLeft:20
    },
    qu:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    tijiao:{
        fontSize:14,
        color:'#FF305E',

    }
})