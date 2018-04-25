import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter
} from 'react-native';
import Storage from '../common/GGAsyncStorage'

var event='http://122.112.196.52:8080/mtool/portal/api/'
var API={
    Register:"http://122.112.196.52:8080/mtool/portal/api/communication/smsverificode/registuser",
    Search:'http://122.112.196.52:8080/mtool/portal/api/orderdining/search_merchant_order',
    SearchDetail:event+'orderdining/search_order_detail',
    ForgetPwd:event+'communication/smsverificode/forgetpassword',
    Password:event+'communication/smsverificode/identification',
    ResetPwd:event+'user/member/updatepassword',
    Order:event+'orderdining/search_pending_order',
    chaoshi:event+'orderdining/exec_order_cancel',
    OrderDetail:event+'orderdining/search_pending_order_detail',
    RefuseOrder:event+'merchantRefuseReason/application_back_order',
    BuChongOrder:event+'orderdiningrefund/save_order_reason',
    ListOrder:event+'foodgroup/view_food_group',
    ResetListOrder:event+'foodgroup/add_food_group',
    DelectListOrder:event+'foodgroup/del_food_group',
    PaiXu:event+'foodgroup/exchange_food_group',
    ClassifyDetail:event+'foodgroup/find_food_group_detail',
    TotalGoods:event+'foodinfo/view_foodinfo_shop',
    // ShangChuan:'http://img.dahonghuo.com.cn/fileService/file/upload/'+'png',img.zhaomini.com
    ShangChuan:'http://122.112.196.52:8080/fileService/file/upload/'+'png',
    // ShangChuan:'http://59.110.1.160:8081/fileService/file/upload/'+'png',
    GuanLi:event+'merchantrestaurants/restaurantsallofee_detail',

    GoodsAddings:event+'foodinfo/add_foodinfo_shop',
    PeiSongType:event+'expressage/merchant/shop_restaurantsallofee_list',
    FeiYongReset:event+'merchantrestaurants/update_restaurantsallofee_shop',
    TotalHuifu:event+'merchantusershortmsg/list_merchantusershortmsg',
    AddingHuifu:event+'merchantusershortmsg/add_merchantusershortmsg',
    DelectHuifu:event+'merchantusershortmsg/del_merchantusershortmsg',
    GengHuifu:event+'merchantusershortmsg/update_merchantusershortmsg',
    BianJiGoods:event+'foodinfo/find_foodinfo_detail_edit',
    DelectGoodsManage:event+'foodinfo/del_food',
    SoureGeng:event+'foodinfo/upt_foodinfo_detail_edit',
    DianPuMessage:event+'merchantrestaurants/view_restaurants_msg',
    DianPuReset:event+'merchantrestaurants/edit_restaurants',
    PickerYuE:event+'merchantrestaurants/account_detail',
    Shouzi:event+'total/countmemberaccount/account_income_expenses',
    TodayDetail:event+'user/memberaccountdetail/mem_account_detail',
    BaoZhangJin:event+'user/memberaccount/add_account_number',
    YingYe:event+'merchantrestaurants/update_restaurants_status',
    DongTai:event+'forum/post/findforumPost',
    TianJiaFenl:event+'foodinfo/add_food_by_group',
    RefuseOrderShuoM:event+'orderdiningrefund/save_order_reason',
    ShanChuGoods:event+'foodinfo/del_food_by_group',
    AccountSercitys:event+'user/member/userImfo',
    JieDan:event+'orderdining/accept_pending_order_edit',
    SureSongDa:event+'orderdining/confirmOrder',
    YiChangOrder:event+'orderdining/search_exception_order',
    ZhangJing:event+'user/memberaccount/account_detail',
    WeChatZhif:event+'orderrecharge/create_order_recharge',
    HistoryOrder:event+'orderdining/search_complete_merchant_order',
    OrderSec:event+'orderdining/search_pending_order',
    HeXiaoDetail:event+'orderdining/order_cancellation_detail',
    ShureHeXiao:event+'orderdining/order_dining_submit',
    ReportDongTai:event+'forum/post/createforumPost',
    PingLunDetail:event+'forum/post/forumPost_detail',
    DongTaiPingLund:event+'forum/postcomment/find_forumpost_comment',
    OrderPingJai:event+'orderdining/ordered_dining_comment',
    DaiSongF:event+'merchantrestaurants/view_restaurants_msg',
    ChangYong:event+'orderdining/order_dining_address',
    PetSongFei:event+'orderdining/count_deliverfee',
    GoZhiFu:event+'sendorderpayinfo/create_replace_send_pay_order',
    DaiSongOrderList:event+'orderdining/ordered_dining_helpsend_search',
    ShanChuDongTai:event+'forum/post/delete',
    ZhangHuMingxi:event+'user/memberaccountdetail/account_income_expenses_current_month',
    MineZhan:event+'forum/post/find_suppopp_byuserid',
    DianZan:event+'forum/postsuppopp/create_suppopp',
    QuXiaoZan:event+'forum/postsuppopp/delete_suppopp',
    BianjiMingCheng:event+'member/membercollectcatalog/create_user_goodscollect_catalog',
    DongTaiShouCang:event+'forum/postcollect/create',
    QuXiaoDongTaiShouCang:event+'forum/postcollect/delete_corumpost_collect',
    ShouCangDongApi:event+'member/membercollectcatalog/view_user_goodscollect_catalog',
    MineDongTaiFirst:event+'forum/post/find_myforumpost_byuserid',
    MineDongTaiSec:event+'forum/post/find_myresource_byuserid',
    SearchShouCang:event+'member/membercollectcatalog/look_user_goodscollect_catalog',
    SheZhiClassify:event+'member/membercollectcatalog/add_user_goodscollect_catalog_detail',
    BianjiShouCang:event+'member/membercollectcatalog/edit_user_goodscollect_catalog',
    DelectShouCangClassify:event+'member/membercollectcatalog/del_user_goodscollect_catalog',
    ReportPingLun:event+'forum/postcomment/create',
    DianAdd:event+'merchantrestaurants/add_restaurants_img',
    DianDelect:event+'merchantrestaurants/reduce_restaurants_img',
    ToolsDetail:event+'orderdining/search_pending_order_detail',
    SearchDongTai:event+'comm/searchkeyword/find_forum_by_content',
    SearchHot:event+'comm/searchkeyword/find_search_keyword_by_hot',
    SearchShouCangdet:event+'comm/searchkeyword/find_collect_by_keyword',
    SearchGreated:event+'forum/post/find_suppopp_byuserid',
    SearchOrder:event+'orderdining/ordered_history_search',
    TuiChuLogin:event+'user/member/logout',
    DuanXinYanZheng:event+'communication/smsverificode/loginuser',
    DuanXinLogin:event+'user/member/loginUser',
    JingXuanPL:event+'forum/postcomment/find_selected_comment',
    UserDetails:event+'forum/post/findUserShopCollectByUserAndMerchant',
    GuanZhuUser:event+'chatrelation/create_chat_relation',
    QuXiaoGuanZhuUser:event+'chatrelation/deleteChatRelation',
    YinSi:event+'chatfriend/finduserSeting',
    YinSiSetting:event+'chatfriend/user_seting',
    BiaoQianSetting:event+'chatbooklabel/findlabelNameBymemberId',
    BiaoQianGuanli:event+'chatbooklabel/find_book_labelBymemId',
    TianJIaBiaoQian:event+'chatbooklabel/create_book_labelBymemId',
    BiaoQianXiaUser:event+'chatbooklabel/findUserMemberInfoBylabelId',
    GuanZhuYonghu:event+'chatrelation/find_chatrelation_idol_byuserid',
    AddFirendToNew:event+'chatbooklabel/create_book_labelinfoBymemId',
    DelectBiaoQainUser:event+'chatbooklabel/delete_book_labelinfoBymemId',
    PingBiManage:event+'user/member/findBlacklistUserByHxName',
    PingBiManageLaChu:event+'user/member/deleteBlacklistUserByHxName',
    BianJIBiaoQianName:event+'chatbooklabel/update_book_labelBymemId',
    DelectBiaoQian:event+'chatbooklabel/delete_book_labelBymemId',
    FensView:event+'chatrelation/find_chatrelation_fans_byuserid',
    YingHuSetting:event+'chatbooklabel/create_book_labelinfoByLabel',
    YinSiViewSettingSe:event+'user/usermemberseting/finduserSeting',
    YinSiViewSettingReset:event+'user/usermemberseting/userSeting',
    ZhiFuBaoPay:event+'user/memberaccount/add_user_account_number',
    QunGuanLi:event+'user/member/finduser_by_hxgroupId',
    ZhuanZhang:event+'merchantuserbankinfo/list_bank_default',
    AddNewCard:event+'merchantuserbankinfo/add_bank',
    TiXianView:event+'comm/commwithdrawinfo/withdrawinfo',
    SearchAllCard:event+'merchantuserbankinfo/list_bank',
    WanShanPersonal:event+'user/member/perfect',
    FenXiangDaoDong:event+'forum/post/shareforumPost',

}

var ObjectTransform = (obj)=>{

    var tempStr = "";

    for(var key in obj){

        tempStr += key+"="+obj[key]+"&";
    }

    let index = tempStr.lastIndexOf('&');

    tempStr = tempStr.substring(0,index);

    return tempStr;

}

var getFetch=function (url,data,success,failure) {
    var str=ObjectTransform(data);
    return fetch(url+"?"+str,{
        method:"GET",
        headers:{
            "Authorization":"bearer "+token,
        }
    }).then((response)=>response.json()).then((responseData)=>{
        success(responseData)
    }).catch((error)=>{
        if(failure!=null){
            failure(error)
        }
    }).done()

}

var postFetch=(url,data,success,failure,tempthis) =>{


    var config=null;
    config = {

        method:"POST",
         // body:ObjectTransform(data),
        body:JSON.stringify(data),
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
    };

    // if(token==null){
    //     config = {
    //
    //         method:"POST",
    //         body:ObjectTransform(data),
    //         headers:{
    //             "Content-Type":"application/x-www-form-urlencoded",
    //         }
    //     };
    // }else {
    //     config = {
    //
    //         method:"POST",
    //         body:ObjectTransform(data),
    //         headers:{
    //             "Authorization":"bearer "+token,
    //             "Content-Type":"application/x-www-form-urlencoded",
    //         }
    //     };
    // }
    return fetch(url,config).then((response)=>{
        return response.json()
})

        .then((result) => {
        // alert(JSON.stringify(result))
           if(result.status==2){
               // alert(JSON.stringify(result))
              Storage.get('phoneNumber').then((phoneNumber)=>{
                  // phone=phoneNumber
                  // Storage.get('pwd').then((pwd)=>{
                      Storage.get('isFirstL').then((isLogin)=>{
                          Storage.get('isLogin').then((userId)=> {
                              if (isLogin == true||userId==true) {
                                  // pwds=pwd
                                  // alert(isLogin)
                                  fetch("http://122.112.196.52:8080/mtool/portal/api/user/member/free_login", {
                                      method: "POST",
                                      headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
                                      body: JSON.stringify({
                                          // username: phoneNumber,
                                          // password: pwd
                                          phone: phoneNumber
                                      })
                                  }).then((response) => (
                                      response.json()
                                  ).then((responseData) => {
                                      // alert(JSON.stringify(responseData))

                                      if (responseData.status == 1) {
                                          // toast.show(responseData.msg)
                                          // Storage.save("isLogin",true);
                                           Storage.save("phoneNumber",phoneNumber);
                                           // Storage.save("pwd",pwd)
                                          Storage.save("userId",responseData.data.id)
                                          // Storage.save("userId",responseData.data.id)
                                          //  alert(JSON.stringify(responseData.data))
                                          // this.props.navigation.navigate('Index');
                                          Storage.save("isLogin",true);
                                          Storage.save("qrCode",responseData.data.qrCode)
                                          DeviceEventEmitter.emit('HOMEPAGE','Index重新加载');
                                      } else {
                                          // toast.show(responseData.msg)
                                      }

                                  }).catch((error) => {

                                  }))

                              }
                          })
                      })


                  // })
              })


           }else {
               success(result);
           }


        }).catch((error) => {

            failure != null && failure(error);
        });
}

module.exports={API,ObjectTransform,getFetch,postFetch}