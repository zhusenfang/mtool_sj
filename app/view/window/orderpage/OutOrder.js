import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView,
    DeviceEventEmitter
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import SearchPage from '../../SearchPage'
import OrderFirst from './OrderFirst';
import OrderSecond from './OrderSecond'
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import Storage from '../../../common/GGAsyncStorage'
var navigation=null
export default class OutOrder extends Component {
    constructor(props){
        super(props);
        this.state={
            msg:'',
            msgtow:''
        }
        navigation=this.props.navigation
    }
    componentWillMount(){
        this.poststatus()
    }
    componentDidMount(){
        this.listener=DeviceEventEmitter.addListener('HOMEPAGE',(e)=>{
            // alert(e)
            this.poststatus()
        })
    }
    componentWillUnmount(){
        this.listener.remove()
    }
    poststatus(){
        postFetch(API.OrderSec,{orderDining:{status:0,diningType:0},pageNum:1,numPerPage:10},(result)=>{

            if(result.status==1){
                this.setState({
                    msg:result.page.totalCount
                })
            }else {
                // if(result.status==2){
                //    this.poststatus()
                // }
            }
        },(error)=>{
            // alert(error)

        })
        postFetch(API.OrderSec,{orderDining:{status:0,diningType:1},pageNum:1,numPerPage:10},(result)=>{

            if(result.status==1){
                this.setState({
                    msgtow:result.page.totalCount
                })
            }
            // else {
            //     if(result.status==2){
            //         this.poststatus()
            //     }
            // }
        },(error)=>{
            // alert(error)

        })
        // Storage.get('phoneNumber').then((phoneNumber)=>{
        //     // phone=phoneNumber
        //     Storage.get('pwd').then((pwd)=>{
        //         // Storage.get('isFirstL').then((isLogin)=>{
        //         //     Storage.get('isLogin').then((userId)=> {
        //         //         if (isLogin == true||userId==true) {
        //                     // pwds=pwd
        //                     // alert(isLogin)
        //                     fetch("http://mtool.zhaomini.com/mtool/portal/api/user/member/login", {
        //                         method: "POST",
        //                         headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
        //                         body: JSON.stringify({
        //                             username: phoneNumber,
        //                             password: pwd
        //                         })
        //                     }).then((response) => (
        //                         response.json()
        //                     ).then((responseData) => {
        //                         // alert(JSON.stringify(responseData))
        //
        //                         if (responseData.status == 1) {
        //                             // toast.show(responseData.msg)
        //                             // Storage.save("isLogin",true);
        //                             // Storage.save("phoneNumber",phoneNum);
        //                             // Storage.save("pwd",pwd)
        //                             // Storage.save("userId",responseData.data.id)
        //                             //  alert(JSON.stringify(responseData.data))
        //                             // this.props.navigation.navigate('Index');
        //
        //                         } else {
        //                             // toast.show(responseData.msg)
        //                         }
        //
        //                     }).catch((error) => {
        //
        //                     }))
        //
        //         //         }
        //         //     })
        //         // })
        //
        //
        //     })
        // })
    }
    render(){
        return(<View style={{flex:1,marginTop:20,backgroundColor:'#f9f9f9'}}>
            <Tabs
            initialPage={0}
             // heading="OrderFirst"
             tabBarUnderlineStyle={{backgroundColor:"#459CF4",justifyContent:"center",width:130,alignSelf:'center',marginLeft:Contants.Screen.width/11}}

            >
            <Tab
                heading={<TabHeading style={{backgroundColor:"white",alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:14,color:'#282828',backgroundColor: 'transparent'}}>外送订单</Text>
                    <Image source={require('../../../img/order/bluequ.png')} style={{alignItems:'center',justifyContent:'center',marginLeft:5}}>
                    <Text style={{color:"white",backgroundColor: 'transparent'}}>{this.state.msg}</Text></Image></TabHeading>}
                activeTextStyle={{color:"#000000"}}
                textStyle={{color:"#000000"}}
                tabStyle={{backgroundColor:"white"}}
                activeTabStyle={{backgroundColor:"white"}}

            >
            <OrderFirst navigation={navigation}/>

            </Tab>

                <Tab   heading={<TabHeading style={{backgroundColor:"white",alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <Text style={{fontSize:14,color:'#282828',backgroundColor: 'transparent',}}>到店订单</Text>
                    <Image source={require('../../../img/order/greenqu.png')} style={{alignItems:'center',justifyContent:'center',marginLeft:5}}>
                    <Text style={{color:"white",backgroundColor: 'transparent'}}>{this.state.msgtow}</Text></Image></TabHeading>}
                     activeTextStyle={{color:"#000000"}}
                     textStyle={{color:"#000000"}}
                     tabStyle={{backgroundColor:"white"}}
                     activeTabStyle={{backgroundColor:"white"}}
                     // tabBarUnderlineStyle={{backgroundColor:'red'}}
                >
            <OrderSecond navigation={navigation}/>

            </Tab>
            </Tabs>
        </View>)
    }
}