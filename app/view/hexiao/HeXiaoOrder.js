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
    BackHandler,
    Platform
} from 'react-native';
import Contants from '../../common/Contants';

import {API,postFetch} from '../../common/GConst'
import Toast from "react-native-easy-toast";

import {Container, Tab, Tabs,TabHeading} from 'native-base';

// var TimerMixin=require('react-timer-mixin');
import Modal from 'react-native-modal'
// var comdtime=600;
import comstyle from '../../common/CommonStyle'
export default class HeXiaoOrder extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            deliveryMethod:'',
            appointtime:'',
            totalprice:'',
            orderPayType:'',
            time:0,
            name:'',
            phone:'',
            deliveryType:'',
            id:''
        }
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled: false,

    })

    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }

    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
        const list=this.props.navigation.state.params.data;
        if(list==null){
            const lists=this.props.navigation.state.params.datas;
            const s=lists.substring(77)
            // alert(lists)39.106.205.201
            fetch('http://122.112.196.52:8080/mtool/portal/api/orderdining/order_cancellation_detail/'+s,{
                method:"GET",
                // headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                // body:JSON.stringify({
                //     flag:1,
                //     pageSize:10,
                //     currentPage:pageNo,
                //     symbol:id,
                //
                // })
            }).then((response)=>(
                response.json()
            ).then((result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(result.data.orderDetailSkuList),
                        deliveryMethod:result.data.status,
                        appointtime:result.data.createTime,
                        totalprice:result.data.totalPrice,
                        orderid:result.data.orderNumber,
                        orderPayType:result.data.orderPayType,
                        name:result.data.memUsername,
                        phone:result.data.userMember.phone,
                        // deliveryType:result.data.deliveryType
                        id:result.data.id,
                    })
                    if(result.data.deliveryType==1){
                        this.setState({
                            time:result.data.appointTime
                        })
                    }else {
                        this.setState({
                            time:null
                        })
                    }
                }else {
                    this._toast.show(result.msg)
                }
            }))
            // postFetch(API.HeXiaoDetail,{orderDining:{
            //     headingCode:s
            // }},(result)=>{
            //   // alert(JSON.stringify(result))
            //     if(result.status==1){
            //         this.setState({
            //             dataSource:this.state.dataSource.cloneWithRows(result.data.orderDetailSkuList),
            //             deliveryMethod:result.data.status,
            //             appointtime:result.data.createTime,
            //             totalprice:result.data.totalPrice,
            //             orderid:result.data.orderNumber,
            //             orderPayType:result.data.orderPayType,
            //             name:result.data.memUsername,
            //             phone:result.data.userMember.phone,
            //             // deliveryType:result.data.deliveryType
            //             id:result.data.id,
            //         })
            //         if(result.data.deliveryType==1){
            //             this.setState({
            //                 time:result.data.appointTime
            //             })
            //         }else {
            //             this.setState({
            //                 time:null
            //             })
            //         }
            //     }else {
            //         this._toast.show(result.msg)
            //     }
            // },(error)=>{
            //     this._toast.show(error)
            // })
        }else {
            postFetch(API.HeXiaoDetail,{orderDining:{
                headingCode:list
            }},(result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data.orderDetailSkuList),
                        deliveryMethod:result.data.status,
                        appointtime:result.data.createTime,
                        totalprice:result.data.totalPrice,
                        orderid:result.data.orderNumber,
                        orderPayType:result.data.orderPayType,
                        name:result.data.memUsername,
                        phone:result.data.userMember.phone,
                        // deliveryType:result.data.deliveryType
                        id:result.data.id,
                    })
                    if(result.data.deliveryType==1){
                        this.setState({
                            time:result.data.appointTime
                        })
                    }else {
                        this.setState({
                            time:null
                        })
                    }
                }
            },(error)=>{
                this._toast.show(error)
            })
        }

    }
    render(){
        var contentView=null;
        if(this.state.deliveryMethod!=undefined&&this.state.deliveryMethod==1){
            contentView=(
                <TouchableOpacity style={styles.da}  onPress={this.songda.bind(this)}>
                    <Image style={[styles.da,{marginLeft:10}]} source={require('../../img/window/tijiao.png')}>
                        <Text style={styles.text}>确认核销</Text>
                    </Image>
                </TouchableOpacity>
            )
        }else {
            if(this.state.deliveryMethod==3){
                contentView=(<View style={{justifyContent:'center',alignItems:'center',marginLeft:Contants.Screen.width/3+20}}><Text style={{fontSize:14,color:'#FF305E'}}>该订单已使用</Text></View>)
            }else {
                contentView=(<View style={{justifyContent:'center',alignItems:'center',marginLeft:Contants.Screen.width/3+20}}><Text style={{fontSize:14,color:'#FF305E'}}>该订单已评价</Text></View>)
            }

        }

        // const list=this.props.navigation.state.params.data;
        return(
            <View style={styles.contain}>

                <ScrollView style={{width:Contants.Screen.width}} >
                    <View style={styles.top}>


                        {contentView}


                    </View>
                    <View style={[comstyle.item,{marginTop:20}]}>
                        <View style={comstyle.rightview}>
                            <Image source={require('../../img/hexiao/daodian.png')} style={comstyle.maleft}/>
                            <Text style={[styles.dao,{marginLeft:10}]}>{'到店-有效期内'}</Text>
                            {/*<Text style={styles.dao}>{this.state.deliveryType==0?'立即配送':'定时'}</Text>*/}
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
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                    <View style={styles.beizhu}>
                        <Text style={comstyle.maleft}>{"合计"+this.state.totalprice+'元'}</Text>

                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                    {/*<View style={comstyle.item}>*/}
                        {/*<Text style={comstyle.maleft}>配送费</Text>*/}
                        {/*<Text style={comstyle.textright}>{'￥'+this.state.deliverFee}</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>*/}
                    <ListView
                        style={styles.list}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                    />
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                    <View style={[comstyle.item,{marginTop:20}]}>
                        <View style={comstyle.rightview}>
                            <Image source={require('../../img/hexiao/dingdan.png')}  style={comstyle.maleft}/>
                            <Text style={comstyle.mesg}>订单信息</Text>
                        </View>
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                    <View style={styles.ding}>
                        <Text style={comstyle.maleft}>订单号码：</Text>
                        <Text>{this.state.orderid}</Text>
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                    <View style={styles.ding}>
                        <Text  style={comstyle.maleft}>订单时间：</Text>
                        <Text style={styles.apptime}>{new Date(this.state.time).getFullYear()+'.'}</Text>
                        <Text style={styles.apptime}>{new Date(this.state.time).getMonth()+1+'.'}</Text>
                        <Text style={styles.apptime}>{new Date(this.state.time).getDate()}</Text>
                        <Text style={[styles.apptime,{marginLeft:10}]}>{new Date(this.state.time).getHours()+':'}</Text>
                        <Text style={styles.apptime}>{new Date(this.state.time).getMinutes()}</Text>
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                    <View style={styles.ding}>
                        <Text style={comstyle.maleft}>支付方式：</Text>
                        <Text>{this.state.orderPayType}</Text>
                    </View>
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>



                    <View style={styles.vies}>

                        <View style={[comstyle.item]}>
                            <View style={comstyle.rightview}>
                                <Image source={require('../../img/hexiao/yonghu.png')}  style={comstyle.maleft}/>
                                <Text style={comstyle.mesg}>用户信息</Text>
                            </View>
                        </View>
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                        <View style={styles.kehu}>
                            <Text style={{marginLeft:20,marginTop:10}}>客户： {this.state.name}</Text>
                            <View style={{flexDirection:'row',marginBottom:10}}>
                                <Text style={{marginLeft:20,marginTop:10}}>电话： </Text>
                                <Text style={{fontSize:14,color:'#459CF4',marginTop:10}}>{this.state.phone}</Text>
                            </View>
                            {/*<Text style={{marginLeft:20,marginTop:10,marginBottom:10}}>地址： {this.state.adress}</Text>*/}
                        </View>
                        {/*<View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginBottom:20}}></View>*/}
                    </View>

                    <Toast ref={(e) => {
                        this._toast = e
                    }}
                           position='center'
                    />

                </ScrollView>
            </View>)
    }
    _renderRow=(rowData)=>{
        return(
            <View>
                <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}></View>
                <View style={{justifyContent:'space-between',flexDirection:'row',height:46,alignItems:'center'}}>
                    <Text style={comstyle.maleft}>{rowData.goodsName}</Text>
                    <Text style={comstyle.textright}>{" x  "+rowData.quantity}{"  /  "+rowData.price+'元'}</Text>

                </View>
            </View>)
    }
    songda(){
        // alert(this.state.id)
        postFetch(API.ShureHeXiao,{orderDining:{id:this.state.id}},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this._toast.show(result.msg)
                this.props.navigation.navigate('Index')
            }
        },(error)=>{
            this._toast.show(error)
        })
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
        // justifyContent:'space-between',
        alignItems:'center',
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
     flexDirection:'row',
        alignSelf:'center'
    },
    dao:{
        fontSize:14,
        color:'#33BAB2'
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