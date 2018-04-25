import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants'
import Toast from 'react-native-easy-toast';
import *as wechat from 'react-native-wechat'
// import {CheckBox} from "native-base";
import CheckBox from '../../CommonPage/GGCheckView'
import Alipay from 'react-native-yunpeng-alipay';
import Modal from 'react-native-modal'
import dismissKeyboard from 'dismissKeyboard'
export default class AddNewCard extends Component{
       constructor(props){
           super(props)
           this.state={
               name:'',
               kahao:'',
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
    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
           BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    render(){
        return(<View style={comstyle.con}>
             <Text style={styles.textka}>请绑定持卡本人的银行卡</Text>
            <View style={styles.kal}>
                <Text style={[comstyle.text,comstyle.maleft]}>持卡人</Text>
                <TextInput
                    onChangeText={(e)=>{
                        this.setState({
                           name:e,
                        })}}
                    underlineColorAndroid='transparent'
                    style={styles.input}
                />
            </View>
            <View style={comstyle.heng}/>
            <View style={styles.kal}>
                <Text style={[comstyle.text,comstyle.maleft]}>卡号</Text>
                <TextInput
                    onChangeText={(e)=>{
                        this.setState({
                            kahao:e,
                        })}}
                    underlineColorAndroid='transparent'
                    style={styles.inputs}
                />
            </View>
            <TouchableOpacity style={styles.chong} onPress={this.tianjia.bind(this)}>
                <Image
                    source={require('../../../img/shezhi/chongzhi.png')}
                    style={styles.chong}
                >
                    <Text style={styles.zhi}>添加</Text>
                </Image>
            </TouchableOpacity>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)
    }
    tianjia(){
        this.props.navigation.state.params.callbacks()
        dismissKeyboard()
        postFetch(API.AddNewCard,{name:this.state.name,bankCarNo:this.state.kahao},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this._toast.show(result.msg)
                this.props.navigation.state.params.callbacks('回调')

                this.props.navigation.goBack();
            }else {
                this._toast.show(result.msg)
            }
        },(error)=>{

        })
    }
}
const styles=StyleSheet.create({
    textka:{
        fontSize:12,
        color:'#B2B2B2',
        marginTop:10,
        marginLeft:20
    },
    input:{
        width:Contants.Screen.width-80,
        alignSelf:'center',
        marginLeft:20
        // marginBottom:20
    },
    kal:{
        flexDirection:'row',
        height:46,
        alignItems:'center',
        backgroundColor:'white',
    },
    chong:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    zhi:{
        color:'white',
    },
    inputs:{
        width:Contants.Screen.width-80,
        alignSelf:'center',
        marginLeft:35
        // marginBottom:20
    },
})