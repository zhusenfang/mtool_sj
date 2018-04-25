//用户须知


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
    BackHandler,
    Platform
} from 'react-native';
import Contants from '../../common/Contants'
import comstyle from '../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../common/GConst'
import ToolsTotal from "./ToolsTotal";
export default class UserXuZhi extends Component{
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
        return(<View style={comstyle.contain}>

            <View style={[styles.con,{marginTop:20}]}>
                <Text style={styles.text}>1.重量限定：单件货物重量不得>25公斤</Text>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={styles.con}>
                <Text style={styles.text}>2.体积限定：单件货物体积不得>0.4立方米</Text>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={styles.con}>
                <Text style={styles.text}>3.配送距离：仅限当地市区范围</Text>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={styles.for}>
                <Text style={styles.text}>4.计价规则：2公里范围内，每单8元；3-5公里加一块；6-10公里加1.5块；11-15公里加2块；超出15公里后，每公里加3元。特殊行业价格会有浮动(如：蛋糕、数码)</Text>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={styles.for}>
               <Text style={styles.text}>5.禁止发布有关涉及各种手枪、步枪、气枪、子弹(包含工艺品)等管制刀具的任务信息。</Text>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={styles.for}>
                <Text style={styles.text}>6.禁止发布有关涉及各种弓、弩、金属刀、剑制品(包含工艺品)等管制刀具的任务信息。</Text>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={styles.for}>
                <Text style={styles.text}>7.不得包含带有腐蚀性、有毒性化学制品、易燃、易爆、危险物品以及毒品、传播性疾病的病原体等法律、法规禁止和限制流通的物品</Text>
            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
            <View style={styles.for}>
                <Text style={styles.text}>8.违约责任{'\n'}1）跑男在完成订单过程中，因故意或者过失给平台方造成损失的，必须按照损失的金额进行赔偿。</Text>

            </View>
            <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
        </View>)
    }
}
const styles=StyleSheet.create({
    con:{
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40
    },
    text:{
       fontSize:12,
        color:'#282828',
        marginLeft:20,
        marginRight:20
    },
    for:{
        height:66,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
    }
})