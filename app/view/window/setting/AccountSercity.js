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
    Dimensions,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
// import RadioModal from 'react-native-radio-master';
// import ImagePicker from 'react-native-image-picker'
import Storage from '../../../common/GGAsyncStorage'
const s=[]

let {width, height} = Dimensions.get('window');
export default class AccountSercity extends Component{


    constructor(props) {
        super(props);
        this.state = {
            isEdict: false,//是否编辑状态
            selectArray: [],
            id:"",
            phone:'',
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
        postFetch(API.AccountSercitys,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    id:result.data.id,
                    phone:result.data.phone
                })
            }
        })

    }
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#f9f9f9',flexDirection:'column',}}>

                <View style={[styles.item,{marginTop:41}]}>
                    <Text style={styles.text}>手机</Text>
                    <TouchableOpacity style={comstyle.time} onPress={()=>{this.props.navigation.navigate('GaiBangPhone')}}>
                        <Text style={styles.phone}>{this.state.phone}</Text>
                        <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.heng}/>
                <View style={[styles.item]}>
                    <Text style={styles.text}>登录密码</Text>
                    <TouchableOpacity style={comstyle.time} onPress={()=>{this.props.navigation.navigate('AccountYanZheng',{data:this.state.phone})}}>
                        <Text style={styles.wei}>未设置</Text>
                        <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.heng}/>
                <TouchableOpacity style={styles.quit} onPress={this.quit.bind(this)}>
                    <Text style={styles.tui}>退出登录</Text>
                </TouchableOpacity>
            </View>
        );
    }
    quit(){
        var te=this
        postFetch(API.TuiChuLogin,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                Storage.delete('isLogin');
                Storage.delete('phoneNumber');
                Storage.delete('pwd');
                Storage.delete('userId');
                Storage.delete('isFirstL');
                Storage.delete('qrCode')
                setTimeout(function () {
                    te.props.navigation.navigate('Index',{data:0})
                },1000)
            }
        })
    }
}
const styles=StyleSheet.create({
    con:{
        width:Contants.Screen.width/3,
        marginLeft:Contants.Screen.width/2,
        alignItems:'center',
        justifyContent:'center',
        margin:20,
        height:40,
        backgroundColor:'white'
    },
    heng:{
        flexDirection:'row',
        height:1,
        width:335,
        backgroundColor:'#E5E5E5',
        alignSelf:'center',
    },
    text:{
        fontSize:14,
        color:'#2D2D2D',
        marginLeft:20
    },
    wei:{
        fontSize:14,
        color:'#B2B2B2',
        marginRight:10,
    },
    phone:{
        fontSize:18,
        color:'#2D2D2D',
        marginRight:10,

    },
    quit:{
        marginTop:40,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#E5E5E5',
        backgroundColor:'#FFFFFF',
        height:35,
        width:335,
        alignSelf:'center',
        borderRadius:4
    },
    tui:{
        fontSize:14,
        color:'#B2B2B2',

    },
    item:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        // backgroundColor:'white',
        height:46
    }

})