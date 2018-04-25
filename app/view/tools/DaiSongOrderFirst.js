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
    ScrollView
} from 'react-native';
import ActionButton from 'react-native-action-button';
import comstyle from '../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../common/GConst'
import MyTimer from '../../common/MyTimer'
import Contants from '../../common/Contants';
var TimerMixin=require('react-timer-mixin');

export default class DaiSongOrderFirst extends Component{
    constructor(props){
        super(props)
        this.state={
         daiprice:'',
         peisongprice:'',
          whopei:'',
            courierName:'',
        time:'',
            name:'',
            phone:'',
            address:'',
            orderPayType:'',
            shopID:'',
            deliverFee:'',
            status:''
        }
    }
    componentWillMount() {
        const list = this.props.navigation.state.params.data;
        // alert(JSON.stringify(list))
        postFetch(API.ToolsDetail,{orderDining:{id:list}},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
             this.setState({
                 daiprice:result.data.totalPrice,
                 whopei:result.data.courierName,
                 courierName:result.data.courierPhone,
                 time:result.data.createTime,
                 name:result.data.consignee,
                 phone:result.data.consigneePhone,
                 address:result.data.consigneeAddr,
                 orderPayType:result.data.orderPayType,
                 shopID:result.data.shopId,
                 deliverFee:result.data.deliverFee,
                 status:result.data.status,

             })
            }
        },(error)=>{

        })
    }
    render(){
        const list = this.props.navigation.state.params.data;
        return(<ScrollView style={comstyle.contain}>
            <View style={[comstyle.item,{marginTop:20}]}>
                <View style={comstyle.rightview}>
                <Text style={styles.state}>订单状态:</Text>
                <Text style={styles.state}>{this.state.status==0?'待结单':this.state.status==1?'待取餐':this.state.status==2?'待送达':'已完成'}</Text>
                </View>
            </View>
            <View style={[comstyle.item,{marginTop:20}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../img/order/bluelijips.png')}  style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,styles.colstyle]}>服务信息</Text>
                </View>
            </View>
            <View style={styles.heng}/>
            <View style={styles.ding}>
                <Text style={comstyle.maleft}>代收金额：</Text>
                <Text>{this.state.daiprice+'元'}</Text>
            </View>
            <View style={styles.heng}/>
            <View style={styles.ding}>
                <Text style={comstyle.maleft}>配送费用：</Text>
                <Text>{this.state.deliverFee+'元'}</Text>
            </View>
            <View style={styles.heng}/>
            <View style={styles.ding}>
                <Text style={comstyle.maleft}>配送员：</Text>
                <Text>{this.state.whopei==undefined?'待接单':this.state.whopei+'/'}</Text>
                <Text style={styles.colstyle}>{this.state.courierName}</Text>
            </View>
            <View style={[comstyle.item,{marginTop:20}]}>
                <View style={comstyle.rightview}>
                    <Image source={require('../../img/order/blueorder.png')}  style={comstyle.maleft}/>
                    <Text style={[comstyle.mesg,styles.colstyle]}>订单信息</Text>
                </View>
            </View>
            <View style={styles.heng}/>
            <View style={styles.ding}>
                <Text style={comstyle.maleft}>订单号码：</Text>
                <Text>{this.state.shopID}</Text>
            </View>
            <View style={styles.heng}/>
            <View style={styles.ding}>
                <Text  style={comstyle.maleft}>订单时间：</Text>
                <Text style={styles.apptime}>{new Date(this.state.time).getFullYear()+'.'}</Text>
                <Text style={styles.apptime}>{new Date(this.state.time).getMonth()+1+'.'}</Text>
                <Text style={styles.apptime}>{new Date(this.state.time).getDate()}</Text>
                <Text style={[styles.apptime,{marginLeft:10}]}>{new Date(this.state.time).getHours()+':'}</Text>
                <Text style={styles.apptime}>{new Date(this.state.time).getMinutes()}</Text>
            </View>
            <View style={styles.heng}/>
            <View style={styles.ding}>
                <Text style={comstyle.maleft}>支付方式：</Text>
                <Text>{this.state.orderPayType}</Text>
            </View>
            <View style={styles.heng}/>
            <View style={styles.vies}>

                <View style={[comstyle.item]}>
                    <View style={comstyle.rightview}>
                        <Image source={require('../../img/order/blueuser.png')}  style={comstyle.maleft}/>
                        <Text style={[comstyle.mesg,styles.colstyle]}>用户信息</Text>
                    </View>
                </View>
                <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                <View style={styles.kehu}>
                    <Text style={{marginLeft:20,marginTop:10}}>客户： {this.state.name}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{marginLeft:20,marginTop:10}}>电话： </Text>
                        <Text style={{fontSize:14,color:'#459CF4',marginTop:10}}>{this.state.phone}</Text>
                    </View>
                    <Text style={{marginLeft:20,marginTop:10,marginBottom:10}}>地址： {this.state.address}</Text>
                </View>
                <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginBottom:20}}></View>
            </View>
            {/*<View style={[comstyle.item,{marginTop:10}]}>*/}
                {/*<Text style={comstyle.maleft}>订单评价</Text>*/}
                {/*<TouchableOpacity onPress={()=>{*/}
                    {/*if(this.state.status==4){*/}
                        {/*this.props.navigation.navigate('PingJiaView',{data:list})*/}
                    {/*}else {*/}
                        {/*this._toast.show('用户未评价')*/}
                    {/*}*/}
                {/*}}>*/}
                    {/*<Image source={require('../../img/shezhi/jian.png')}  style={comstyle.textright}/>*/}
                {/*</TouchableOpacity>*/}
            {/*</View>*/}
            {/*<View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginBottom:40}}></View>*/}
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </ScrollView>)
    }

}
const styles=StyleSheet.create({
    apptime:{
        fontSize:14,
        color:'#282828',
        // marginRight:20
    },
    ding:{
        flexDirection:'row',
        alignItems:'center',
        height:46,
        backgroundColor:'#FFFFFF'
    },
    heng:{
        width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'
    },
    colstyle:{
       fontSize:14,
       color:'#459CF4'
    },
    kehu:{
        flexDirection:'column',

    },
    vies:{
        width:Contants.Screen.width,
        // height:100,
        backgroundColor:'white',
        marginTop:20
    },
state:{
    fontSize:14,
    color:'#459CF4',
    marginLeft:20
}
})