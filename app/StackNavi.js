import React, {Component} from "react";
import {

    AppRegistry,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    Platform

} from "react-native";

import {

    StackNavigator,
    DrawerNavigator

} from "react-navigation"
import Index from './index';
import OrderPage from './view/OrderPage';
import Contents from '../app/common/Contants'
//公告
import PublicOder from './view/window/PublicOder'



//登录，注册，忘记密码
//import Login from './view/Login';
import Login from './view/Zhu_Login';

import Register from './view/Register';
//import ForgetView from './view/ForgetView'
import ForgetView from './view/Zhu_ForgetView'
import ForgetViewTwo from './view/Zhu_ForgetViewTwo'
import ForgetViewThree from './view/Zhu_ForgetViewThree'



//搜索
import SearchView from './view/window/SearchView';
import RestaurantView from './view/window/RestaurantView';
import RestaurantSec from './view/window/RestaurantSec';
import SearchResult from './view/window/SearchResult';
import SearchDetail from './view/window/SearchDetail'
import DaiSongView from './view/window/DaiSongView';
import ResetPwd from './view/ResetPwd'


//订单
import TotalOrder from './view/window/orderpage/TotalOrder';
import ComonModal from './view/CommonPage/ComonModal';
import OrderDetails from './view/window/orderpage/OrderDetails';
import OrderFirst from './view/window/orderpage/OrderFirst';
import BeiZhu from './view/window/orderpage/BeiZhu';
import  RefuseOrder from './view/window/orderpage/RefuseOrder';
import  MainSetting from './view/window/setting/MainSetting';
import  ClassifyOrder from './view/window/setting/ClassifyOrder';
import ClassifyPaiXu from './view/window/setting/ClassifyPaiXu';
import  ClassifyDetails from './view/window/setting/ClassifyDetails';
import ClassifyAdd from './view/window/setting/ClassifyAdd';
import GoodsManage from './view/window/setting/GoodsManage';
import  GoodsAdding from './view/window/setting/GoodsAdding';
import FeiYongManage from './view/window/setting/FeiYongManage';
import QuicklyInput from './view/window/setting/QuicklyInput';
import BianJiGoods from './view/window/setting/BianJiGoods';
import  AccountSercity from './view/window/setting/AccountSercity';
import DianMessage from './view/window/setting/DianMessage';
import  MessageMain from './view/window/message/MessageMain';
import  MineMessage from './view/window/message/MineMessage';
import  PicketMoney from './view/window/message/PicketMoney';
import  AccountInCom from './view/window/message/AccountInCom';
import TodayDetail from './view/window/message/TodayDetail';
import ConsumerMoney from './view/window/message/ConsumerMoney';
import  MineEnjoyed from './view/window/message/MineEnjoyed';
//
import NewsMain from './view/window/news/NewsMain';
import NewsMessage from './view/window/news/NewsMessage';
import DongTai from './view/window/news/DongTai';
import TongXunLu from './view/window/news/TongXunLu';
import HeXiaoView from './view/hexiao/HeXiaoView'
import ToolsTotal from './view/tools/ToolsTotal'
import AccountYanZheng from './view/window/setting/AccountYanZheng';
import EndOrder from './view/window/orderpage/EndOrder';
import EndOrderFirst from './view/window/orderpage/EndOrderFirst';
import EndOrderSecond from './view/window/orderpage/EndOrderSecond';
import MyOrder from './view/tools/MyOrder';
import DaiSongOrder from './view/tools/DaiSongOrder';
import UserXuZhi from './view/tools/UserXuZhi';
import MyGreated from './view/window/message/MyGreated';
import DongTaiDetails from './view/window/news/DongTaiDetails';
import DongTaiFirst from './view/window/news/DongTaiFirst';
import DongTaiPing from './view/window/news/DongTaiPing';
import ProgressOrderDetail from './view/window/orderpage/ProgressOrderDetail';
import YiChangOrder from './view/window/orderpage/YiChangOrder';
import ChargeView from './view/window/message/ChargeView';
import DaoOrderDetail from './view/window/orderpage/DaoOrderDetail';
import ProgressNews from './view/window/orderpage/ProgressNews';
import CommonModal from './view/CommonPage/ComonModal';
import ProgressDaoDetails from './view/window/orderpage/ProgressDaoDetails'
import ShouDongWrite from './view/hexiao/ShouDongWrite'
import HeXiaoOrder from './view/hexiao/HeXiaoOrder';
import  HeXiaoNews from './view/hexiao/HeXiaoNews'
import OrderDetail from './view/hexiao/OrderDetail'
import ReportDongTai from './view/window/news/ReportDongTai'
import GreatedView from './view/window/news/GreatedView'
import EndOrderDetails from './view/window/orderpage/EndOrderDetails'
import PingJiaView from './view/window/orderpage/PingJiaView'
import DaiSongOrderDetail from './view/tools/DaiSongOrderDetail'
import DaiSongOrderFirst from './view/tools/DaiSongOrderFirst'
import DaiSongOrderSec from './view/tools/DaiSongOrderSec'
import ZhangMingXi from './view/window/message/ZhangMingXi'
import MineDongTai from './view/window/message/MineDongTai'
import MineDongTaiFirst from './view/window/message/MineDongTaiFirst'
import MineDongTaiSec from './view/window/message/MineDongTaiSec'
import ShouCangDong from './view/window/message/ShouCangDong'
import BianJiName from './view/window/message/BianJiName'
import SaFeView from './view/SaFeView'
import MyMapView from './view/tools/MyMapView'
import SearchDongTai from './view/window/search/SearchDongTai'
import SearchDongHistory from './view/window/search/SearchDongHistory'
import SearchShouCang from './view/window/search/SearchShouCang'
import SearchShouCangHistory from './view/window/search/SearchShouCangHistory'
import SearchGreated from './view/window/search/SearchGreated'
import SearchGreatedHistory from './view/window/search/SearchGreatedHistory'
import SearchOrder from './view/window/search/SearchOrder'
import SearchOrderHistory from './view/window/search/SearchOrderHistory'
import DuanXinLogin from './view/DuanXinLogin'
import DuanXinRegister from './view/DuanXinRegister'
import GaiBangPhone from './view/window/setting/GaiBangPhone'
import GaiBangYanZheng from './view/window/setting/GaiBangYanZheng'
import  AccountMessage from './view/window/setting/AccountMessage'
import ToolsService from './view/tools/ToolsService'
import OrderDetTotal from './view/window/orderpage/OrderDetTotal'
import OrderDetailNews from './view/window/orderpage/OrderDetailNews'
import OrderSecDetTotal from './view/window/orderpage/OrderSecDetTotal'
import OrderSecDetails from './view/window/orderpage/OrderSecDetails'
import OrderSecNews from './view/window/orderpage/OrderSecNews'
import ProgressDaoTot from './view/window/orderpage/ProgressDaoTot'
import ProgressDaoNews from './view/window/orderpage/ProgressDaoNews'
import EndOrderDetTotal from './view/window/orderpage/EndOrderDetTotal'
import EndOrderNews from './view/window/orderpage/EndOrderNews'
import UserDetails from './view/window/news/UserDetails'
import UserDetailFirst from './view/window/news/UserDetailFirst'
import UserDetailSec from './view/window/news/UserDetailSec'
import UserSetting from './view/window/news/UserSetting'
import BiaoQianSetting from './view/window/news/BiaoQianSetting'
import GuanZhuView from './view/window/news/GuanZhuView'
import  GuanZhuUser from './view/window/news/GuanZhuUser'
import  BiaoQianManage from './view/window/news/BiaoQianManage'
import BianJiBiaoQian from './view/window/news/BianJiBiaoQian'
import  AddNewFirend from './view/window/news/AddNewFirend'
import AddNewFriCard from './view/window/news/AddNewFriCard'
import PingBiManage from './view/window/news/PingBiManage'
import FensView from './view/window/news/FensView'
import CeShiView from './view/window/news/CeShiView'
import YinSiView from './view/window/setting/YinSiView'
import NewsWornView from './view/window/setting/NewsWornView'
import ChatViews from './view/window/news/ChatViews'
import QunManage from './view/window/news/QunManage'
//余额充值
import ChargeRemaind from './view/window/message/ChargeRemaind'
import TiXianView from './view/window/message/TiXianView'
import AddNewCard from './view/window/message/AddNewCard'
import BigImage from './view/window/news/BigImage'
import  CeShiImage from './view/window/news/CeShiImage'
import LocationShareView from './view/window/news/LocationShareView'
import PersonalView from './view/window/setting/PersonalView'
import ShareToDongTai from './view/window/news/ShareToDongTai'
const StackNavi=StackNavigator({
    Index:{
        screen:Index,

    },
    Login:{
        screen:Login,
        // navigationOptions: ({navigation}) => navigationOptions(navigation, "登  录")
    },
 PublicOder:{
     screen:PublicOder,
     navigationOptions: ({navigation}) => navigationOptions(navigation, "公告")
 },
    Register:{
        screen:Register,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "注  册")
    },

    ForgetView:{
     screen:ForgetView,
        navigationOptions: ({navigation}) => Zhu_navigationOptions(navigation, "忘记密码")
    },
    ForgetViewTwo:{
        screen:ForgetViewTwo,
        navigationOptions: ({navigation}) => Zhu_navigationOptions(navigation, "忘记密码")
    },
    ForgetViewThree:{
        screen:ForgetViewThree,
        navigationOptions: ({navigation}) => Zhu_navigationOptions(navigation, "忘记密码")
    },
    DuanXinLogin:{
        screen:DuanXinLogin,
        navigationOptions:({navigation}) => Zhu_navigationOptions(navigation, "短信登录")
    },


    SaFeView:{
     screen:SaFeView,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "安全认证")
    },
    ResetPwd:{
     screen:ResetPwd,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "更改密码")
    },


    SearchView:{
        screen:SearchView,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "搜  索")
    },
    RestaurantView:{
        screen:RestaurantView,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "搜  索")
    },
    RestaurantSec:{
        screen:RestaurantSec,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "搜  索")
    },
    SearchResult:{
     screen:SearchResult,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "搜索结果")
    },
    SearchDetail:{
     screen:SearchDetail,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "订单详情")
    },
    DaiSongView:{
     screen:DaiSongView,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "搜  索")
    },


    TotalOrder:{
     screen:TotalOrder,
        // navigationOptions: ({navigation}) => navigationOptions(navigation, "外送")
    },
    ComonModal:{
        screen:ComonModal,
    },
    OrderDetails:{
     screen:OrderDetails,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "订单详情")
    },
    OrderFirst:{
     screen:OrderFirst
    },
    BeiZhu:{
     screen:BeiZhu,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "订单备注")
    },
    RefuseOrder:{
     screen:RefuseOrder,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "申请拒单")
    },
    MainSetting:{
     screen:MainSetting,
        // navigationOptions: ({navigation}) => navigationOptions(navigation, "设置")
    },
    ClassifyOrder:{
     screen:ClassifyOrder,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "商品分类")
    },
    ClassifyPaiXu:{
     screen:ClassifyPaiXu,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "商品分类")
    },
    ClassifyDetails:{
     screen:ClassifyDetails,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "自定义分类")
    },
    ClassifyAdd:{
     screen:ClassifyAdd,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "添加到分类")
    },
    GoodsManage:{
     screen:GoodsManage,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "商品管理")
    },
    GoodsAdding:{
     screen:GoodsAdding,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "添加商品")
    },
    FeiYongManage:{
     screen:FeiYongManage,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "费用管理")
    },
    QuicklyInput:{
     screen:QuicklyInput,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "快捷输入")
    },
    BianJiGoods:{
     screen:BianJiGoods,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "编辑商品")
    },
    AccountSercity:{
     screen:AccountSercity,
        navigationOptions: ({navigation}) => navigationOptions(navigation, "账户与安全")
    },
    DianMessage:{
     screen:DianMessage,
        navigationOptions:({navigation}) => navigationOptions(navigation, "店铺信息")
    },
    MessageMain:{
     screen:MessageMain,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "店铺信息")
    },
    MineMessage:{
     screen:MineMessage,
        navigationOptions:({navigation}) => navigationOptions(navigation, "店铺信息")
    },
    PicketMoney:{
     screen:PicketMoney,
        navigationOptions:({navigation}) => navigationOptions(navigation, "钱   包")
    },
    AccountInCom:{
     screen:AccountInCom,
        navigationOptions:({navigation}) => navigationOptions(navigation, "收资记录")
    },
    TodayDetail:{
     screen:TodayDetail,
        navigationOptions:({navigation}) => navigationOptions(navigation, "订单详情")
    },
    ConsumerMoney:{
     screen:ConsumerMoney,
        navigationOptions:({navigation}) => navigationOptions(navigation, "钱   包")
    },
    MineEnjoyed:{
     screen:MineEnjoyed,
        navigationOptions:({navigation}) => navigationOptions(navigation, "我的收藏")
    },
    NewsMain:{
     screen:NewsMain,

    },
    NewsMessage:{
     screen:NewsMessage,

    },
    DongTai:{
     screen:DongTai,

    },
    TongXunLu:{
     screen:TongXunLu
    },
    HeXiaoView:{
     screen:HeXiaoView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "核   销")
    },
    ToolsTotal:{
     screen:ToolsTotal,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "代送服务")
    },
    AccountYanZheng:{
     screen:AccountYanZheng,
        navigationOptions:({navigation}) => navigationOptions(navigation, "安全验证")
    },
    EndOrder:{
     screen:EndOrder,
        navigationOptions:({navigation}) => navigationOptions(navigation, "安全验证")
    },
    EndOrderFirst:{
     screen:EndOrderFirst,

    },EndOrderSecond:{
     screen:EndOrderSecond
    },
    MyOrder:{
     screen:MyOrder,
        navigationOptions:({navigation}) => navigationOptions(navigation, "我的订单")
    },
    DaiSongOrder:{
     screen:DaiSongOrder,
    },
    UserXuZhi:{
     screen:UserXuZhi
    },
    MyGreated:{
     screen:MyGreated,
        navigationOptions:({navigation}) => navigationOptions(navigation, "我赞过的")
    },
    DongTaiDetails:{
     screen:DongTaiDetails,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "我赞过的")
    },
    DongTaiFirst:{
     screen:DongTaiFirst
    },
    DongTaiPing:{
     screen:DongTaiPing,
        navigationOptions:({navigation}) => navigationOptions(navigation, "动态评论")
    },
    ProgressOrderDetail:{
     screen:ProgressOrderDetail,
     navigationOptions:({navigation}) => navigationOptions(navigation, "我的订单")
    },
    YiChangOrder:{
     screen:YiChangOrder,
        navigationOptions:({navigation}) => navigationOptions(navigation, "异常订单")
    },
    ChargeView:{
     screen:ChargeView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "钱   包")
    },
    DaoOrderDetail:{
     screen:DaoOrderDetail
    },
    ProgressNews:{
     screen:ProgressNews
    },
    ProgressDaoDetails:{
     screen:ProgressDaoDetails
    },
    ShouDongWrite:{
     screen:ShouDongWrite,
        navigationOptions:({navigation}) => navigationOptions(navigation, "核销订单")
    },
    HeXiaoNews:{
     screen:HeXiaoNews,

    },
    OrderDetail:{
     screen:OrderDetail
    },
    HeXiaoOrder:{
     screen:HeXiaoOrder
    },
    ReportDongTai:{
     screen:ReportDongTai,
        navigationOptions:({navigation}) => navigationOptions(navigation, "发布动态")
    },
    GreatedView:{
     screen:GreatedView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "赞过的人")
    },
    EndOrderDetails:{
     screen:EndOrderDetails,
        navigationOptions:({navigation}) => navigationOptions(navigation, "我的订单")
    },
    PingJiaView:{
     screen:PingJiaView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "订单评价")
    },
    DaiSongOrderDetail:{
     screen:DaiSongOrderDetail,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "订单评价")
    },
    DaiSongOrderFirst:{
     screen:DaiSongOrderFirst,

    },
    DaiSongOrderSec:{
     screen:DaiSongOrderSec,
    },
    ZhangMingXi:{
     screen:ZhangMingXi,
        navigationOptions:({navigation}) => navigationOptions(navigation, "账单明细")
    },
    MineDongTai:{
     screen:MineDongTai
    },
    MineDongTaiFirst:{
     screen:MineDongTaiFirst
    },
    MineDongTaiSec:{
     screen:MineDongTaiSec
    },
    ShouCangDong:{
     screen:ShouCangDong,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "收藏的动态")
    },
    BianJiName:{
     screen:BianJiName,
        navigationOptions:({navigation}) => navigationOptions(navigation, "编辑名称")
    },
    MyMapView:{
     screen:MyMapView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "定位区域")
    },
    SearchDongTai:{
     screen:SearchDongTai,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索动态")
    },
    SearchDongHistory:{
     screen:SearchDongHistory,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索历史")
    },
    SearchShouCang:{
     screen:SearchShouCang,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索收藏")
    },
    SearchShouCangHistory:{
     screen:SearchShouCangHistory,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索历史")
    },
    SearchGreated:{
     screen:SearchGreated,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索赞过")
    },
    SearchGreatedHistory:{
     screen:SearchGreatedHistory,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索历史")
    },
    SearchOrder:{
     screen:SearchOrder,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索订单")
    },
    SearchOrderHistory:{
     screen:SearchOrderHistory,
        navigationOptions:({navigation}) => navigationOptions(navigation, "搜索历史")
    },
    DuanXinRegister:{
        screen:DuanXinRegister,
        navigationOptions:({navigation}) => navigationOptions(navigation, "短信登录")
    },
    GaiBangPhone:{
        screen:GaiBangPhone,
        navigationOptions:({navigation}) => navigationOptions(navigation, "改绑手机")
    },
    GaiBangYanZheng:{
        screen:GaiBangYanZheng,
        navigationOptions:({navigation}) => navigationOptions(navigation, "改绑手机")
    },
    AccountMessage:{
        screen:AccountMessage,
        navigationOptions:({navigation}) => navigationOptions(navigation, "安全认证")
    },
    ToolsService:{
     screen:ToolsService,
        navigationOptions:({navigation}) => navigationOptions(navigation, "代送服务")
    },
    OrderDetTotal:{
     screen:OrderDetTotal
    },
    OrderDetailNews:{
     screen:OrderDetailNews,

    },
    OrderSecDetTotal:{
     screen:OrderSecDetTotal
    },
    OrderSecDetails:{
     screen:OrderSecDetails,
        navigationOptions:({navigation}) => navigationOptions(navigation, "订单详情")
    },
    OrderSecNews:{
     screen:OrderSecNews
    },
    ProgressDaoTot:{
     screen:ProgressDaoTot,
    },
    ProgressDaoNews:{
     screen:ProgressDaoNews,
    },
    EndOrderDetTotal:{
     screen:EndOrderDetTotal
    },
    EndOrderNews:{
     screen:EndOrderNews
    },
    UserDetails:{
     screen:UserDetails
    },
    UserDetailFirst:{
     screen:UserDetailFirst
    },
    UserDetailSec:{
     screen:UserDetailSec
    },
    UserSetting:{
     screen:UserSetting,
     navigationOptions:({navigation}) => navigationOptions(navigation, "用户设置")
    },
    BiaoQianSetting:{
     screen:BiaoQianSetting,
     navigationOptions:({navigation}) => navigationOptions(navigation, "设置标签")
    },
    GuanZhuView:{
     screen:GuanZhuView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "关  注")
    },
    GuanZhuUser:{
     screen:GuanZhuUser,
        navigationOptions:({navigation}) => navigationOptions(navigation, "关注的用户")
    },
    BiaoQianManage:{
     screen:BiaoQianManage,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "标签管理")
    },
    BianJiBiaoQian:{
     screen:BianJiBiaoQian,
        navigationOptions:({navigation}) => navigationOptions(navigation, "编辑标签")
    },
    AddNewFirend:{
     screen:AddNewFirend,
        navigationOptions:({navigation}) => navigationOptions(navigation, "添加新成员")
    },
    AddNewFriCard:{
     screen:AddNewFriCard,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "添加好友到新标签")
    },
    PingBiManage:{
     screen:PingBiManage,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "屏蔽管理")
    },
    FensView:{
     screen:FensView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "粉   丝")
    },
    CeShiView:{
     screen:CeShiView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "粉   丝")
    },
    YinSiView:{
     screen:YinSiView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "隐私设置")
    },
    NewsWornView:{
     screen:NewsWornView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "新消息提醒")
    },
    ChatViews:{
     screen:ChatViews,
        // navigationOptions:({navigation}) => navigationOptions(navigation, "消息")
    },
    QunManage:{
     screen:QunManage,
        navigationOptions:({navigation}) => navigationOptions(navigation, "群聊管理")
    },
    ChargeRemaind:{
     screen:ChargeRemaind,
        navigationOptions:({navigation}) => navigationOptions(navigation, "钱  包")
    },
    TiXianView:{
     screen:TiXianView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "钱  包")
    },
    AddNewCard:{
     screen:AddNewCard,
        navigationOptions:({navigation}) => navigationOptions(navigation, "添加银行卡")
    },
    BigImage:{
     screen:BigImage,
    },
    CeShiImage:{
     screen:CeShiImage
    },
    LocationShareView:{
     screen:LocationShareView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "分 享")
    },
    PersonalView:{
     screen:PersonalView,
        navigationOptions:({navigation}) => navigationOptions(navigation, "个人信息")
    },
    ShareToDongTai:{
     screen:ShareToDongTai,
        navigationOptions:({navigation}) => navigationOptions(navigation, "分享到动态")
    }

},{
    initialRouteName:'Index',//之前是index 现在改为login
    initialRouteParams: {isShowActivity: true},
    mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    gesturesEnabled:false,
    onTransitionStart: () => {
    }, // 回调
    onTransitionEnd: () => {
    }  // 回调

})
/* *************************通用导航栏************************* */

const navigationOptions = (navigation, title, isBackHome) => {


    var header = (
        <View>
        <CommonModal style={{position:'absolute', zIndex:1000,}} navigation={navigation} />
        <View  style={Styles.headerContainer}>
            {/*内容*/}
            <Text allowFontScaling={false} style={Styles.middleTitle}>
                {title}
            </Text>

            {/*左边返回按钮*/}
            <TouchableOpacity style={Styles.leftImgBtn} onPress={() => {

                if (isBackHome) {

                    navigation.goBack('Index');

                } else {

                    navigation.goBack(null);

                }

            }}>
            <Image source={require("./img/page/arrow.png")}/>
            </TouchableOpacity>


            {/*<View style={Styles.leftImgBtn}/>*/}

        </View>
        </View>
    );

    var gesturesEnabled = false;

    return {header, gesturesEnabled};

}

const Zhu_navigationOptions = (navigation, title, isBackHome) => {


    var header = (
        <View style={{backgroundColor: "#fff"}}>
            <View
                style={{
                height: 45,
                backgroundColor: "#fff",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingRight: 0,
                width:Contents.Screen.width,
                marginTop:(Platform.OS=='android')?10:25,
                    paddingLeft:10,

            }}>
                {/*内容*/}

                {/*左边返回按钮*/}
                <TouchableOpacity style={{  width:45  }}
                                  onPress={() => {

                    if (isBackHome) {

                        navigation.goBack('Index');

                    } else {

                        navigation.goBack(null);

                    }

                }}>
                    <Image source={require("./img/login/gob.png")}/>
                </TouchableOpacity>
                <View style={{
                    height: 45,
                    width:Contents.Screen.width-100,
                    justifyContent: "center",
                    alignItems:'center',

                }}>
                <Text style={{
                    textAlign:'center',
                    color:'#FF305E',
                    width:'100%',
                    alignItems:'center',
                    fontSize: 18,}} allowFontScaling={false} >
                    {title}
                </Text>
                </View>


                {/*<View style={Styles.leftImgBtn}/>*/}

            </View>
        </View>
    );

    var gesturesEnabled = false;

    return {header, gesturesEnabled};

}

const Styles = StyleSheet.create({

    //导航栏样式
    headerContainer: {

        height: 60,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 0,
        width: "100%",
        marginTop:0

    },

    leftImgBtn: {
        width: 105,
        height: 55,
        alignItems: "flex-end",
        justifyContent: "center",
         // marginLeft:Contents.Screen.width/3+30,
        // position:'absolute',
        alignSelf:'flex-end',
        marginRight:Contents.Screen.width/6+25.5,
        // backgroundColor:'red',
    },

    middleTitle: {

        fontSize: 18,
        marginLeft:20,
        color:'#4D4D4D'
    },
    image:{
        position:'absolute',

    }
})


export default StackNavi;