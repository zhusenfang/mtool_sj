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
    AppState,
    ScrollView,
    Button,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import SearchPage from '../../SearchPage'
import OrderPage from '../../OrderPage'
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import MyTimer from '../../../common/MyTimer'
// var TimerMixin=require('react-timer-mixin');
import Modal from 'react-native-modal'
// var comdtime=600;
import comstyle from '../../../common/CommonStyle'
// var tim=new Date()
export default class EndOrderDetails extends Component {
    constructor(props){
        super(props)
        this.state={
            time:0,//订单时间
            //listview的
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            name:'',//客户姓名
            phone:'',
            adress:'',//地址
            totalprice:0,//合计
            type:0,//订单类型
            isShowModal:false,
            changeTime:'',
            isChangeName:false,
            deliveryMethod:0,
            deliveryType:0,
            appointtime:'',
            deliverFee:'',
            orderid:'',
            orderPayType:'',
            animating:true,
            status:''
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        this.setState({
            animating:false
        })
    }
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        const list=this.props.navigation.state.params.data;
        // alert(JSON.stringify(list))
        postFetch(API.OrderDetail,{orderDining:{id:list}},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data.orderDetailSkuList),
                    time:result.data.createTime,

                    name:result.data.consignee,
                    phone:result.data.consigneePhone,
                    adress:result.data.consigneeAddr,
                    totalprice:result.data.totalPrice,
                    type:result.data.diningType,
                    deliveryMethod:result.data.deliveryMethod,
                    deliveryType:result.data.deliveryType,
                    // appointtime:result.data.appointTime,
                    deliverFee:result.data.deliverFee,
                    orderid:result.data.id,
                    orderPayType:result.data.orderPayType,
                    status:result.data.status,
                })
                if(result.data.appointTime!=undefined){
                    this.setState({
                        appointtime:result.data.appointTime,
                    })
                }
            }
        },(error)=>{
            alert(error)
        })

    }

    render(){
        // alert(JSON.stringify(this.state.appointtime))
        var contentView=null;
        if(this.state.deliveryMethod!=undefined&&this.state.deliveryMethod==1){
            contentView=(
                <View style={styles.da}>
                    <Image style={[styles.da,{marginLeft:10}]} source={require('../../../img/window/baocun.png')}>
                        <Text style={styles.text} onPress={this.songda.bind(this)}>确认送达</Text>
                    </Image>
                </View>
            )
        }else {
            contentView=(<View/>)
        }
        // contentContainerStyle={{backgroundColor:"white"}}
        const list=this.props.navigation.state.params.data;
        return(
            <View style={styles.contain}>
                {/*<ActivityIndicator*/}
                {/*// animating={this.state.animating}*/}
                {/*size="small"*/}
                {/*style={{alignItems:'center',justifyContent:'center',padding:8}}*/}
                {/*/>*/}
                <ScrollView style={{width:Contants.Screen.width}} >
                    <View style={styles.top}>
                        {/*<Text style={styles.text} onPress={()=>{*/}
                        {/*this.props.navigation.navigate('RefuseOrder',{data:list})*/}
                        {/*}}>申请拒单</Text>*/}

                        {/*{contentView}*/}

                        <View style={styles.da}>
                            <Image style={[styles.da]} source={require('../../../img/window/tijiao.png')}>
                                <Text style={styles.text}>打印订单</Text>
                            </Image>
                        </View>
                    </View>
                    <View style={[comstyle.item,{marginTop:20}]}>
                        <View style={comstyle.rightview}>
                            <Image source={require('../../../img/order/bluelijips.png')} style={comstyle.maleft}/>
                            <Text style={[styles.dao,{marginLeft:10}]}>{this.state.type==0?'外送-':'到店'}</Text>
                            <Text style={styles.dao}>{this.state.deliveryType==0?'立即配送':'定时'}</Text>
                        </View>
                        <View style={[comstyle.time,{marginRight:20}]}>
                            <Text style={styles.apptime}>{new Date(this.state.appointtime).getFullYear()+'-'}</Text>
                            <Text style={styles.apptime}>{new Date(this.state.appointtime).getMonth()+1+'-'}</Text>
                            <Text style={styles.apptime}>{new Date(this.state.appointtime).getDate()}</Text>
                            <Text style={[styles.apptime,{marginLeft:10}]}>{new Date(this.state.appointtime).getHours()+':'}</Text>
                            <Text style={styles.apptime}>{new Date(this.state.appointtime).getMinutes()}</Text>
                            {/*<Text style={styles.apptime}>{new Date(this.state.appointtime).getSeconds()}</Text>*/}
                        </View>
                    </View>
                    {/*合计*/}
                    <View style={comstyle.heng}/>
                    <View style={styles.beizhu}>
                        <Text style={[comstyle.maleft,comstyle.text]}>{"合计："+this.state.totalprice+'元'}</Text>

                    </View>
                    <View style={comstyle.heng}/>
                    <View style={comstyle.item}>
                        <Text style={[comstyle.maleft,comstyle.text]}>配送费</Text>
                        <Text style={[comstyle.textright,comstyle.text]}>{'￥'+this.state.deliverFee}</Text>
                    </View>
                    {/*<View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>*/}
                    <ListView
                        style={styles.list}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                    />
                    <View style={comstyle.heng}/>
                    <View style={[comstyle.item,{marginTop:20}]}>
                        <View style={comstyle.rightview}>
                            <Image source={require('../../../img/order/blueorder.png')}  style={comstyle.maleft}/>
                            <Text style={[comstyle.mesg,{fontSize:14,color:'#459CF4'}]}>订单信息</Text>
                        </View>
                    </View>
                    <View style={comstyle.heng}/>
                    <View style={styles.ding}>
                        <Text style={[comstyle.maleft,comstyle.text]}>订单号码：</Text>
                        <Text style={comstyle.text}>{this.state.orderid}</Text>
                    </View>
                    <View style={comstyle.heng}/>
                    <View style={styles.ding}>
                        <Text  style={[comstyle.maleft,comstyle.text]}>订单时间：</Text>
                        <Text style={comstyle.text}>{new Date(this.state.time).getFullYear()+'.'}</Text>
                        <Text style={comstyle.text}>{new Date(this.state.time).getMonth()+1+'.'}</Text>
                        <Text style={comstyle.text}>{new Date(this.state.time).getDate()}</Text>
                        <Text style={[comstyle.text,{marginLeft:10}]}>{new Date(this.state.time).getHours()+':'}</Text>
                        <Text style={comstyle.text}>{new Date(this.state.time).getMinutes()}</Text>
                    </View>
                    <View style={comstyle.heng}/>
                    <View style={styles.ding}>
                        <Text style={[comstyle.maleft,comstyle.text]}>支付方式：</Text>
                        <Text style={comstyle.text}>{this.state.orderPayType}</Text>
                    </View>
                    <View style={comstyle.heng}/>



                    <View style={styles.vies}>

                        <View style={[comstyle.item]}>
                            <View style={comstyle.rightview}>
                                <Image source={require('../../../img/order/blueuser.png')}  style={comstyle.maleft}/>
                                <Text style={[comstyle.mesg,{fontSize:14,color:'#459CF4'}]}>用户信息</Text>
                            </View>
                        </View>
                        <View style={comstyle.heng}/>
                        <View style={styles.kehu}>
                            <Text style={[comstyle.text,{marginLeft:20,marginTop:10}]}>客户： {this.state.name}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={[comstyle.text,{marginLeft:20,marginTop:10}]}>电话： </Text>
                                <Text style={{fontSize:14,color:'#459CF4',marginTop:10}}>{this.state.phone}</Text>
                            </View>
                            <Text style={[comstyle.text,{marginLeft:20,marginTop:10,marginBottom:10}]}>地址： {this.state.adress}</Text>
                        </View>
                        <View style={comstyle.heng}/>
                    </View>
                    <TouchableOpacity style={[comstyle.item,{marginTop:10}]} onPress={()=>{
                        if(this.state.status==4){
                            this.props.navigation.navigate('PingJiaView',{data:list})
                        }else {
                            this._toast.show('用户未评价')
                        }
                    }}>
                        <Text style={[comstyle.maleft,comstyle.text]}>订单评价</Text>
                        <TouchableOpacity onPress={()=>{
                            if(this.state.status==4){
                                this.props.navigation.navigate('PingJiaView',{data:list})
                            }else {
                                this._toast.show('用户未评价')
                            }
                            }}>
                        <Image source={require('../../../img/shezhi/jian.png')}  style={comstyle.textright}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginBottom:40}}></View>
                    <Toast ref={(e) => {
                        this._toast = e
                    }}
                           position='center'
                    />

                </ScrollView>
            </View>)
    }
    modal(){
        this.setState({
            isShowModal:true
        })
    }
    shouli(){
        const list=this.props.navigation.state.params.data;

        postFetch(API.JieDan,{orderDining:{
            id:list,
            status:'1',
            totalProcessTime:this.state.changeTime,
            deliveryMethod:1

        }},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.props.navigation.navigate('TotalOrder')
            }
        })
    }
    songda(){
        const list=this.props.navigation.state.params.data;
        postFetch(API.SureSongDa,{orderDining:{id:list}},(result)=>{
            alert(JSON.stringify(result))
            if(result.status==0){
                this._toast.show(result.data)
            }else {
                this._toast.show('确认送达')
            }
        })

    }
    _renderRow=(rowData)=>{
        return(
            <View>
                <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                <View style={{justifyContent:'space-between',flexDirection:'row',height:46,alignItems:'center'}}>
                    <Text style={[comstyle.maleft,comstyle.text]}>{rowData.goodsName}</Text>
                    <Text style={[comstyle.textright,comstyle.text]}>{" x  "+rowData.quantity}{"  /￥"+rowData.price}</Text>

                </View>
            </View>)
    }
}
const styles=StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    top:{
        flexDirection:'row',
        width:Contants.Screen.width,
        marginTop:25,
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        // width:40,
        // height:20,
        fontSize:14,
        // marginLeft:30,30
        // backgroundColor:'white',
        // marginRight:30,
        color:'#FF305E'

    },
    heng:{
        width:Contants.Screen.width,
        height:1,
        backgroundColor:"#C0C0C0"
    },
    zhican:{
        flexDirection:'row',
        width:Contants.Screen.width,
        marginTop:20,
        justifyContent:'space-between',
        backgroundColor:'white',

    },
    white:{
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'white'
    },
    img:{
        width:20,
        height:20,
        marginRight:10
    },
    textc:{
        marginRight:20
    },
    beizhu:{
        justifyContent:'space-between',
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
        height:46,
        alignItems:'center'
    },
    list:{
        width:Contants.Screen.width,
        // height:100,
        backgroundColor:"white"
    },
    kehu:{
        flexDirection:'column',

    },
    mesg:{
        marginBottom:10,
        marginLeft:10
    },
    vies:{
        width:Contants.Screen.width,
        // height:100,
        backgroundColor:'white',
        marginTop:20
    },
    da:{
        justifyContent:'center',
        alignItems:'center',

    },
    dao:{
        fontSize:14,
        color:'#459CF4'
    },
    apptime:{
        fontSize:14,
        color:'#B2B2B2',
        // marginRight:20
    },
    ding:{
        flexDirection:'row',
        alignItems:'center',
        height:46,
        backgroundColor:'#FFFFFF'
    }
})