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
export default class ProgressDaoDetails extends Component {
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
            orderPayType:''
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        // this.setState({
        //     animating:false
        // })
    }
    componentDidMount(){
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
                    orderPayType:result.data.orderPayType
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

        const list=this.props.navigation.state.params.data;
        return(
            <View style={styles.contain}>
                <ScrollView style={{width:Contants.Screen.width}} >
                    <View style={styles.top}>
                        {/*<Text style={styles.text} onPress={()=>{*/}
                        {/*this.props.navigation.navigate('RefuseOrder',{data:list})*/}
                        {/*}}>申请拒单</Text>*/}
                        <TouchableOpacity style={styles.da} onPress={()=>{
                            this.props.navigation.navigate('RefuseOrder',{data:list})
                        }}>
                            <Image style={[styles.da,{marginLeft:10}]} source={require('../../../img/window/ashanchu.png')}>
                                <Text style={styles.text} onPress={()=>{
                                    this.props.navigation.navigate('RefuseOrder',{data:list})
                                }}>提交异常</Text>
                            </Image>
                        </TouchableOpacity>

                        <View style={styles.da}>
                            <Image style={[styles.da,{marginRight:10}]} source={require('../../../img/window/ashanchu.png')}>
                                <Text style={styles.text}>打印订单</Text>
                            </Image>
                        </View>
                    </View>
                    <View style={[comstyle.item,{marginTop:20}]}>
                        <View style={comstyle.rightview}>
                            <Image source={require('../../../img/hexiao/daodian.png')} style={comstyle.maleft}/>
                            <Text style={[styles.dao,{marginLeft:10}]}>{this.state.type==0?'外送-':'到店'}</Text>
                            <Text style={styles.dao}>{this.state.deliveryType==0?'立即':'预定'}</Text>
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
                            <Image source={require('../../../img/hexiao/dingdan.png')}  style={comstyle.maleft}/>
                            <Text style={[comstyle.mesg,styles.dao]}>订单信息</Text>
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
                    {/*<View style={styles.heng}/>*/}
                    {/*<View style={styles.zhican}>*/}
                    {/*<Text>制餐时间</Text>*/}
                    {/*<View style={styles.white}>*/}
                    {/*<Text style={styles.textc}>{this.state.isChangeName==true?this.state.changeTime:'10分钟'}</Text>*/}
                    {/*<TouchableOpacity onPress={this.modal.bind(this)}>*/}
                    {/*<Image source={require('../../../img/window/write.png')} style={styles.img}/>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View>*/}
                    {/*</View>*/}



                    {/*<View style={styles.beizhu}>*/}
                    {/*<Text>用户备注</Text>*/}
                    {/*<TouchableOpacity onPress={()=>{this.props.navigation.navigate('BeiZhu')}}>*/}
                    {/*<Image source={require('../../../img/window/updoan.png')} style={styles.img}/>*/}
                    {/*</TouchableOpacity>*/}
                    {/*</View>*/}


                    <View style={styles.vies}>

                        <View style={[comstyle.item]}>
                            <View style={comstyle.rightview}>
                                <Image source={require('../../../img/hexiao/yonghu.png')}  style={comstyle.maleft}/>
                                <Text style={[comstyle.mesg,styles.dao]}>用户信息</Text>
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
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginBottom:20}}></View>
                    </View>
                    <Modal
                        isVisible={this.state.isShowModal}
                        hideOnBack={true}
                        transparent={true}
                        style={styles.modalstyle}
                        //backdropColor='transferent'
                        backdropOpacity={0.3}
                    >
                        {/*点击外框，键盘消失*/}
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isShowModal: false});

                            }}
                            style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                        />
                        <View style={{flexDirection:'column',backgroundColor:'white'}}>
                            <Text style={{marginLeft:10}}>制餐时间</Text>
                            <View style={styles.heng}/>
                            <TextInput
                                ref={e => this._nameInput = e}
                                underlineColorAndroid='transparent'
                                style={{
                                    // marginLeft: 20,
                                    backgroundColor: "white",
                                    textAlign: "center",
                                    borderWidth:1,
                                    borderColor:'gray'
                                }}
                                onChangeText={(e)=>{
                                    this.setState({
                                        changeTime:e,
                                    })
                                }}
                                placeholder={'输入时间'}/>
                            <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'space-around'}}>
                                <Button title={'返回'} style={{backgroundColor:'white'}} onPress={()=>{
                                    this.setState({
                                        isShowModal:false
                                    })
                                }}/>
                                <Button title={'确定'} onPress={()=>{
                                    if(this.state.changeTime.length==0){
                                        this._toast.show('时间不能为空');
                                        return
                                    }
                                    this.setState({
                                        isChangeName:true,
                                        isShowModal:false
                                    })

                                }}/>
                            </View>
                        </View>

                    </Modal>
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
            // alert(JSON.stringify(result))
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
        justifyContent:'space-between'
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