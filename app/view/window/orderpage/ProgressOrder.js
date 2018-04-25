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
    AppState
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import ProgressFirst from './ProgressFirst'
import ProgressSecond from './ProgressSecond'
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import MyTimer from '../../../common/MyTimer'
var TimerMixin=require('react-timer-mixin');
var navigation=null
export default class ProgressOrder extends Component {
    constructor(props){
        super(props);
        this.state={
            msg:'',
            msgtow:''
        }
        navigation=this.props.navigation
    }
    componentWillMount(){
        postFetch(API.OrderSec,{orderDining:{status:1,diningType:0},pageNum:1,numPerPage:10},(result)=>{

            if(result.status==1){
               this.setState({
                   msg:result.page.totalCount
               })
            }
        },(error)=>{
            // alert(error)

        })
        postFetch(API.OrderSec,{orderDining:{status:1,diningType:1},pageNum:1,numPerPage:10},(result)=>{

            if(result.status==1){
                this.setState({
                    msgtow:result.page.totalCount
                })
            }
        },(error)=>{
            // alert(error)

        })
    }
    render(){
        return(<View style={{flex:1,marginTop:20,backgroundColor:'#f9f9f9'}}>
            <Tabs
                initialPage={0}

                tabBarUnderlineStyle={{backgroundColor:"#459CF4",justifyContent:"center",width:130,alignSelf:'center',marginLeft:25}}

            >
                <Tab
                    // heading={"外送订单"}
                    heading={<TabHeading style={{backgroundColor:"white",alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <Text style={{fontSize:14,color:'#282828',backgroundColor: 'transparent'}}>外送订单</Text><Image source={require('../../../img/order/bluequ.png')} style={{alignItems:'center',justifyContent:'center',marginLeft:5}}>
                        <Text style={{color:"white",backgroundColor: 'transparent'}}>{this.state.msg}</Text></Image></TabHeading>}
                    activeTextStyle={{color:"#000000"}}
                    textStyle={{color:"#000000"}}
                    tabStyle={{backgroundColor:"white"}}
                    activeTabStyle={{backgroundColor:"white"}}

                >
                    <ProgressFirst navigation={navigation}/>

                </Tab>

                <Tab
                    // heading={"到店订单"}
                    heading={<TabHeading style={{backgroundColor:"white",alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <Text style={{fontSize:14,color:'#282828',backgroundColor: 'transparent'}}>到店订单</Text><Image source={require('../../../img/order/greenqu.png')} style={{alignItems:'center',justifyContent:'center',marginLeft:5}}>
                        <Text style={{color:"white",backgroundColor: 'transparent'}}>{this.state.msgtow}</Text></Image></TabHeading>}
                     activeTextStyle={{color:"#000000"}}
                     textStyle={{color:"#000000"}}
                     tabStyle={{backgroundColor:"white"}}
                     activeTabStyle={{backgroundColor:"white"}}

                >
                    <ProgressSecond navigation={navigation}/>

                </Tab>
            </Tabs>
        </View>)
    }
}