import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    DeviceEventEmitter,
    BackHandler,
    ToastAndroid
} from 'react-native';
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from './common/DfyTabBar'
import {

    StackNavigator,
    DrawerNavigator,
    NavigationActions
} from "react-navigation"
import Modal from 'react-native-modal';
import Contants from './common/Contants';
import Login from './view/Login';
import Storage from './common/GGAsyncStorage'
import {API,postFetch} from './common/GConst'
import EndOrderFirst from './view/window/orderpage/EndOrderFirst'
import ProgressOrder from './view/window/orderpage/ProgressOrder'
import OutOrder from './view/window/orderpage/OutOrder'
import CommonModal from './view/CommonPage/ComonModal'
import JPushModule from 'jpush-react-native';
import LoginModule from './view/nativeModuals/LoginModule'
const tabTcon=[
    require('./img/order/orderunpress.png'),
    require('./img/order/ordersecunpres.png'),
    require('./img/order/orderthunpress.png')
]
const tabTconsel=[
    require('./img/order/orderpress.png'),
    require('./img/order/ordersecpress.png'),
    require('./img/order/orderthpress.png')
]
var navigation=null
export default class Project extends Component {
    constructor(props){
        super(props)
        this.isLogin();
        // this.getisLogin();
        this.state={
            isshowmodal:false,
            isShowClas:false,
            index:true
        }
        navigation=this.props.navigation
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    _androidBack = () => {

        if (this.lastBackPressed && (Date.now() - this.lastBackPressed ) < 2000) {
            BackHandler.exitApp();
        } else {
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按返回退出应用', ToastAndroid.SHORT);
        }

        return true;

    }
    componentWillMount(){
        // BackHandler.removeEventListener('hardwareBackPress',this._androidBack)
    }
    componentDidMount() {
        // alert(this.state.index)
        // if(this.state.index){
        BackHandler.addEventListener('hardwareBackPress', this._androidBack);
         // }else {
            // this.setState({
            //     index:true
            // })

        // }

        this.onlistener=DeviceEventEmitter.addListener('event',(e)=>{
            if(e.action==='TO_ORDER_DETAIL'){
                this.fetchDetails(e.orderId)
            }else  if(e.action==='TO_LOGIN'){
                Storage.delete('isLogin');
                Storage.delete('phoneNumber');
                Storage.delete('pwd');
                Storage.delete('userId');
                Storage.delete('isFirstL');
                Storage.delete('qrCode')
                Storage.delete('picUrl')
                Storage.delete('nickname')
                Storage.delete('sex')
                Storage.delete('birthday')
                Storage.delete('personaldescirpt')
                Storage.delete('address')
                this.props.navigation.navigate('Login');
            }else  if(e.action==='TO_CHATVIEW'){
                // this.setState({
                //     cell:e.HX_ID,
                //     type:e.chatType
                // })

                this.props.navigation.navigate('ChatViews',{data:e.HX_ID,type:e.chatType})
            }
        })
        //android推送
        if(Platform.OS=='android'){
            this.androidjpushConfig();
        }
      this.listener=DeviceEventEmitter.addListener('HOMEPAGE',()=>{
          // this.props.navigation.resetTo({
          //     screen:Index,
          // })
          NavigationActions.reset({
           index:1,
              actions:[NavigationActions.navigate({routeName:'Index'}),]
          })
      })

    }
    fetchDetails(id){
        postFetch(API.OrderDetail,{orderDining:{id:id}},(result)=>{
             if(result.status==1){
                 if(result.data.status==1 || result.data.diningType==0){
                     this.props.navigation.navigate('DaoOrderDetail',{data:id})
                 }else if(result.data.status==2 || result.data.diningType==0){
                     this.props.navigation.navigate('DaoOrderDetail',{data:id})
                 }else if((result.data.status==1 && result.data.status==2)|| result.data.diningType==1){
                     this.props.navigation.navigate('ProgressDaoTot',{data:id})
                 }else if((result.data.status==3 && result.data.status==4)){
                     this.props.navigation.navigate('EndOrderDetTotal',{data:id})
                 }
             }
        },(error)=>{
            alert(error)
        })
    }
    componentWillUnmount(){
       this.listener.remove();
        this.onlistener.remove()
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        //
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();

    }
    androidjpushConfig(){

        JPushModule.initPush((message)=> {

        })
        JPushModule.notifyJSDidLoad((message)=> {

        });

        //收到自定义消息
        JPushModule.addReceiveCustomMsgListener((message)=> {

        });

        //接受正常推送
        JPushModule.addReceiveNotificationListener(  (message) => {
            console.log("receive notification: ");
            console.log(message);
            var extra=JSON.parse(message.extras);
            LoginModule.onNewOrder()

        });


        //用户点击通知之后会触发此事件
        JPushModule.addReceiveOpenNotificationListener((map) => {
            // postFetch(API.OrderDetail,{orderDining:{id:map.extras.orderId}},(result)=>{
            //     if(result.status==1){
            //         if(result.data.status==1 || result.data.diningType==0){
            //             this.props.navigation.navigate('DaoOrderDetail',{data:map.extras.orderId})
            //         }else if(result.data.status==2 || result.data.diningType==0){
            //             this.props.navigation.navigate('DaoOrderDetail',{data:map.extras.orderId})
            //         }else if((result.data.status==1 && result.data.status==2)|| result.data.diningType==1){
            //             this.props.navigation.navigate('ProgressDaoTot',{data:map.extras.orderId})
            //         }else if((result.data.status==0 && result.data.diningType==0)){
            //             this.props.navigation.navigate('OrderDetails',{data:map.extras.orderId})
            //         }else if((result.data.status==0 && result.data.diningType==1)){
            //             this.props.navigation.navigate('OrderSecDetails',{data:map.extras.orderId})
            //         }
            //     }
            // },(error)=>{
            //     alert(error)
            // })
            var message=JSON.parse(map.extras)
            console.log("RNExtras: "+JSON.stringify(map.extras));
            if(message.orderType==0){
                this.props.navigation.navigate('OrderDetails',{data:message.orderId})
            }else if(message.orderType==1){
                this.props.navigation.navigate('OrderSecDetails',{data:message.orderId})
            }

        });


        //获取唯一标示
        JPushModule.getRegistrationID((id)=>{

        })
        Storage.get("userId").then((tagss)=>{
            JPushModule.setAlias(tagss.toString(),(e)=>{
                // alert(JSON.stringify(e))
                // alert('ss')
            })
        })


    }
    // componentWillMount() {

        // this.setState({
        //     isshowmodal:true
        // })
       // Storage.get("isFirstL").then((isLogin)=>{
       //     if(isLogin!==true){
       //
       //         Storage.save("isFirstL",true);
       //         this.props.navigation.navigate("Login")
       //     }else {
       //
       //     }
       // })
    // }
    // isl=async()=>{
    //     const f=await Storage.get('isFirstL').then((isLogin)=>{
    //
    //     })
    // }
    isLogin(){
        Storage.get("isFirstL").then((isLogin)=>{
            Storage.get('isLogin').then((userId)=>{

                if(isLogin!==true||userId!==true){

                    Storage.save("isFirstL",true);
                    this.props.navigation.navigate("Login")
                }else {
                    // if(this.props.navigation.state.params.isShowActivity){
                    //
                    // }
                }
            })

        })


    }
    // componentWillReceiveProps(nextProps){
    //     // let {common}=nextProps
    //     alert(nextProps)
    // }
    async  getisLogin(){
        // var sym=await Storage.get("isFirstL").then((isLogin)=>{
        //   Storage.save('isFirstL',true)
        // })
        // alert(sym)
        // return sym
        let s=await Storage.get('isFirstL');
        let ss=await Storage.get('isLogin');
        if(s!==true||ss!==true){
            let b=await Storage.save('isFirstL',true)

            this.props.navigation.navigate('Login');
        }
        // alert(s)
        return s
    }

    // isLogin=async()=>{
    //     try {
    //         Storage.get("isFirstL").then((isLogin)=>{
    //             Storage.get('userId').then((userId)=>{
    //
    //                 if(isLogin!==true){
    //
    //                     Storage.save("isFirstL",true);
    //                     this.props.navigation.navigate("Login")
    //                 }else {
    //                     if(this.props.navigation.state.params.isShowActivity){
    //
    //                     }
    //                 }
    //             })
    //
    //         })
    //
    //     }catch (e){
    //         alert(e)
    //     }
    // }
    render() {
        // alert(this.state.index)
        // if(this.state.index==false){
        //      BackHandler.addEventListener('hardwareBackPress',this._androidBack)
        // }
        // let tabIconNames = this.state.tabIconNames;
        return (
            <View style={{flex:1,flexDirection:'column',zIndex:100,}}>
                {this.renderHeader()}

                <ScrollableTabView
                    style={{backgroundColor:'#f9f9f9'}}
                    tabBarPosition='top'
                    ref='scrollTabView'
                    renderTabBar={() => <TabBar tabIconNames={tabTcon}
                    selectedTabIconNames={tabTconsel}
                    />}

                    onChangeTab={
                        (obj) => {
                            console.log('被选中的tab下标：' + obj.i);
                        }
                    }

                    onScroll={
                        (position) => {
                            console.log('滑动时的位置：' + position);
                        }
                    }
                >

                    <OutOrder navigation={navigation}/>
                    <ProgressOrder navigation={navigation}/>
                    <EndOrderFirst navigation={navigation}/>

                </ScrollableTabView>

             <Modal
              isVisible={this.state.isshowmodal}
              hideOnBack={true}
              transparent={true}
              style={styles.modalstyle}
              //backdropColor='transferent'
              backdropOpacity={0.3}
              animationIn={'slideInRight'}
              animationOut={'slideOutRight'}
             >
                 {/*点击外框，键盘消失*/}
                 <TouchableOpacity
                     onPress={() => {
                         this.setState({isshowmodal: false});
                      // alert(this.state.isshowmodal)
                     }}
                     style={{position: "absolute", top: 70, left: 0, right: 80, bottom: 0,zIndex:100}}
                 />
              <View style={{alignSelf:'flex-end'}}>
                 <Image source={require("./img/page/background.png")} style={{marginRight:2}}>
                     <View style={{flexDirection:"row",alignItems:"center"}}>
                         <TouchableOpacity style={styles.gonggao} onPress={this.publicord.bind(this)}>
                             <Image source={require("./img/order/shanghuto.png")} />
                             <Text style={styles.comtext}>商户通</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.sousuo} onPress={this.searchview.bind(this)}>
                             <Image source={require("./img/order/shousuo.png")} />
                             <Text style={styles.comtext}>搜 索</Text>
                         </TouchableOpacity>
                         {/*中心红色按钮*/}
                         <TouchableOpacity style={styles.btncons} onPress={()=>{
                             this.setState({
                                 isshowmodal:false
                             })
                         }}>

                             <Image source={require("./img/page/buttonselt.png")} style={styles.btnimgs} />
                         </TouchableOpacity>
                     </View>

                     {/*下面的订单等*/}
                     <View style={{flexDirection:'column',justifyContent:"flex-end",alignSelf:'flex-end',marginRight:15}}>
                         <TouchableOpacity style={styles.dingdan} onPress={this.dingdan.bind(this)}>
                             <Image source={require("./img/order/dingdan.png")} />
                             <Text style={styles.comtext}>订 单</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.xiaoxi} onPress={this.news.bind(this)}>
                             <Image source={require("./img/order/message.png")} />
                             <Text style={styles.comtext}>消 息</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.xiaoxi} onPress={this.gongju.bind(this)}>
                             <Image source={require("./img/order/tools.png")} />
                             <Text style={styles.comtext}>工 具</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.xiaoxi} onPress={this.settingview.bind(this)}>
                             <Image source={require("./img/order/mine.png")}/>
                             <Text style={styles.comtext}>我 的</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.xiaoxi} onPress={this.hexiao.bind(this)}>
                             <Image source={require("./img/order/hexiao.png")}/>
                             <Text style={styles.comtext}>核 销</Text>
                         </TouchableOpacity>
                     </View>
                 </Image>
              </View>
             </Modal>
                <Modal
                    isVisible={this.state.isShowClas}
                    hideOnBack={true}
                    transparent={true}
                    style={styles.modalstyle}
                    //backdropColor='transferent'
                    backdropOpacity={0.5}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isShowClas: false});

                        }}
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                    />

                <TouchableOpacity style={styles.close} onPress={()=>{this.setState({isShowClas:false})}}>
                    <Image source={require('./img/search/close.png')} style={styles.closeimg}/>
                </TouchableOpacity>
                    <View style={styles.fenlei}>
                        <Text style={styles.fenelicol}>请选择您希望搜索的分类</Text>
                    </View>
                    <View style={styles.totcon}>
                    <Text style={styles.shejiao}>社  交</Text>

                    <View style={styles.hengs}/>
                    </View>
                    <View style={styles.gouw}>
                        <Image source={require('./img/search/classify.png')} style={styles.news}>
                            <Text style={styles.totle}>消息/联系人</Text>
                        </Image>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowClas:false
                            })
                            this.props.navigation.navigate('SearchDongTai')
                        }}>
                        <Image source={require('./img/search/classify.png')} style={styles.news}>
                            <Text style={styles.totle}>动 态</Text>
                        </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.totcon}>
                    <Text style={styles.shejiao}>我  的</Text>
                    <View style={styles.hengs}/>
                    </View>
                    <View style={styles.gouw}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                             isShowClas:false
                            })
                            this.props.navigation.navigate('SearchShouCang')}}>
                        <Image source={require('./img/search/classify.png')} style={styles.news}>
                            <Text style={styles.totle}>收 藏</Text>
                        </Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowClas:false
                            })
                            this.props.navigation.navigate('SearchGreated')
                        }}>
                        <Image source={require('./img/search/classify.png')} style={styles.news}>
                            <Text style={styles.totle}>赞 过</Text>
                        </Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowClas:false
                            })
                            this.props.navigation.navigate("SearchOrder")
                        }}>
                        <Image source={require('./img/search/classify.png')} style={styles.news}>
                            <Text style={styles.totle}>订 单</Text>
                        </Image>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        );
    }
    renderHeader(){
        return(

                <View style={styles.headercontainer}>
               <TouchableOpacity style={styles.btncon} onPress={()=>{
                   this.setState({
                       isshowmodal:true
                   })
               }}>

                <Image source={require("./img/page/button.png")} style={styles.btnimg}/>
                </TouchableOpacity>
                </View>

        )
    }
    backpress(){
        if(this.state.index){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
            this.setState({
                index:false
            })
            // alert(this.state.index)

        }else {

        }
    }
    publicord(){
        // this.props.navigation.navigate("Login")
        this.setState({
            isshowmodal:false
        })
    }
    searchview(){
        // this.props.navigation.navigate("SearchView")
        this.setState({
            isshowmodal:false,
            isShowClas:true
        })
    }
    dingdan(){
      // this.props.navigation.navigate('TotalOrder')
        this.setState({
            isshowmodal:false
        })
    }
    settingview(){

        this.props.navigation.navigate('MessageMain',{data:0})
        this.setState({
            isshowmodal:false
        });
        //this.props.navigation.navigate('MineMessage',{data:0})

    }
    news(){
        // this.backpress()
        this.props.navigation.navigate('NewsMain',{data:0})
        this.setState({
            isshowmodal:false
        })
    }
    hexiao(){
        this.props.navigation.navigate('HeXiaoView')
        this.setState({
            isshowmodal:false
        })
    }
    gongju(){
       this.props.navigation.navigate('ToolsService',{data:0})
        this.setState({
            isshowmodal:false
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    img:{
        // width:20,
        // height:20,
        // backgroundColor:"white"
        marginRight:20
    },
    btnimg:{
        width:60,
        height:60,
        marginRight:20
    },
    btncon:{
        marginTop:0,
        alignItems:"center",
        justifyContent:"center",
        // marginBottom:30,
        zIndex:10
    },
    headercontainer:{
        zIndex:1000,
        // marginBottom:40,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        marginTop:10,
        alignSelf:'flex-end'
    },
    modalstyle:{
        backgroundColor:"transparent",
        margin:0,
         position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        marginTop:10,
        alignSelf:'flex-end',
    },
    btncons:{
        marginTop:0,
        alignItems:"center",
        justifyContent:"center",
        // marginBottom:30,
        // marginLeft:Contants.Screen.width/3+29
        marginLeft:20
    },
    btnimgs:{
        width:60,
        height:60,
        marginTop:5,
        marginLeft:13
    },
   publicview:{
        width:20,
       height:20
   },
    gonggao:{
        flexDirection:'column',
        // position:'absolute',
        marginLeft:30,
        // marginTop:10,
        alignItems:'center',
        justifyContent:'center'
    },

    sousuo:{
        flexDirection:'column',
        // position:'absolute',
        // marginTop:10,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:40,
    },
    dingdan:{
        flexDirection:'column',

        alignItems:'center',
        justifyContent:'center',
        // marginLeft:Contants.Screen.width/3+50
        marginTop:30
    },
    xiaoxi:{
        flexDirection:'column',

        alignItems:'center',
        justifyContent:'center',
        // marginLeft:Contants.Screen.width/3+50,
        marginTop:30
    },
    close:{
      marginTop:30,
      flexDirection:'row',
      // justifyContent:'flex-end',
    },
    closeimg:{
        alignSelf:'flex-end',
        marginLeft:302
    },
    fenlei:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    fenelicol:{
        color:'#F9F9F9',
        fontSize:18,
        lineHeight:24
    },
    shejiao:{
        alignSelf:'center',
        fontSize:14,
        color:'#B2B2B2',
        marginTop:24
    },
    hengs:{
        alignSelf:'center',
        width:335,
        height:1,
        backgroundColor:'#B2B2B2',
        flexDirection:'row',
        marginTop:20,
        marginBottom:20,
        marginLeft:15
    },
    gouw:{
        flexDirection:'row',

    },
    news:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginLeft:15
    },
    totle:{
        fontSize:14,
        color:'#4D4D4D'
    },
    totcon:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    comtext:{
        fontSize:12,
        color:'#282828'
    }


});