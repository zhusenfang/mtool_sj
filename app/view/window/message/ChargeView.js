import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    TextInput,
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants'
import Toast from 'react-native-easy-toast';
import *as wechat from 'react-native-wechat'
// import {CheckBox} from "native-base";
import CheckBox from '../../CommonPage/GGCheckView'
import Alipay from 'react-native-yunpeng-alipay';
export default class ChargeView extends Component{
    constructor(props){
        super(props)
        this.state={
            changePrice:'',
            payType:1
        }
    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    componentDidMount (){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}

        wechat.registerApp('wx1ccb336f561e993d')
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    render(){
          return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
              {/*<Text>sss</Text>*/}
              <View style={styles.zhif}>
               <View style={styles.fu}>
                   <Text style={styles.text}>支付方式</Text>
               </View>
                  <View style={styles.bao}>
                     <View style={styles.type}>
                         <CheckBox
                             // color={"#FF305E"}
                             // style={[styles.checkBox,{borderColor:this.state.payType===1?"transparent":"#E5E5E5"}]}
                             // checked={this.state.payType===1}
                             isChecked={this.state.payType===1}
                             onClick={()=>{this._selectPayType(1)}}
                             // onPress={()=>{this._selectPayType(1)}}
                             //  checkedImage={require('../../../img/window/redsqree.png')}
                             // unCheckedImage={require('../../../img/window/huisqree@2x.png')}
                         />
                         <Image source={require('../../../img/shezhi/zhifubao.png')} style={{marginLeft:20}}/>

                         <Text style={styles.zhiftext}>支付宝支付</Text>
                     </View>

                      <View style={styles.type}>
                          <CheckBox
                              // color={"#FF305E"}
                              // style={[styles.checkBox,{borderColor:this.state.payType===2?"transparent":"#E5E5E5"}]}
                              isChecked={this.state.payType===2}
                              onClick={()=>{this._selectPayType(2)}}
                              // checked={this.state.payType===2}
                              // onPress={() => this._selectPayType(2)}
                          />
                          <Image source={require('../../../img/shezhi/weixin.png')} style={{marginLeft:20}}/>
                          <Text style={styles.zhiftext}>微信支付</Text>
                      </View>
                  </View>
              </View>
              <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
              <View style={styles.charg}>
                  <Text style={styles.text}>充值金额</Text>

                  <View style={{flexDirection:'column',}}>
                  <View style={{flexDirection:'row',height:40}}>
                      <View style={{justifyContent:'center'}}>
                          <Image source={require('../../../img/shezhi/renmb.png')} style={[comstyle.maleft]}/>
                      </View>
                      <TextInput style={styles.input}
                                 onChangeText={(e)=>{
                                     this.setState({
                                         changePrice:e,
                                     })}}
                                 underlineColorAndroid='transparent'
                      />
                  </View>
                  <View style={styles.heng}/>
                  </View>
              </View>
              <TouchableOpacity style={styles.chong} onPress={this.zhifu.bind(this)}>
                  <Image
                      source={require('../../../img/shezhi/chongzhi.png')}
                      style={styles.chong}
                  >
                      <Text style={styles.zhi}>下一步</Text>
                  </Image>
              </TouchableOpacity>
              <Toast ref={(e) => {
                  this._toast = e
              }}
                     position='center'
              />
          </View>)
      }
    _selectPayType(index){
        this.setState({
            payType:index
        })
    }
    zhifu(){
          if(this.state.changePrice===''){
              this._toast.show('支付金额不能为空')
              return
          }
    if(this.state.payType===2){
       postFetch(API.WeChatZhif,{totalPrice:this.state.changePrice,pathType:'0',pathName:'微信支付'},(result)=>{
       // alert(JSON.stringify(result))
          if(result.status==1){
           try{
               let payResult=wechat.pay({
                   partnerId:result.data.partnerid,
                   prepayId:result.data.prepayid,
                   nonceStr:result.data.noncestr,
                   timeStamp:result.data.androidtimestamp,
                   package:result.data.package,
                   sign:result.data.androidsign,
               })
           } catch (error){
              alert(error)
           }
       }
   })
    }else {
        postFetch(API.WeChatZhif,{totalPrice:this.state.changePrice,pathType:'1',pathName:'支付宝支付'},(result)=>{
            console.log("zzzzzzzzzzfffffffffffbbbbbbb"+JSON.stringify(result))
            if(result.status===1){
                console.log('ssssssssssssssss'+result.data.body)
                Alipay.pay(result.data.body).then((payResult)=>{
                    // alert(JSON.stringify(payResult))
                   console.log('payresult'+JSON.stringify(payResult))
                    // if(payResult[0].resultStatus === '9000' || payResult.substring(14,18)==='9000'){
                    //
                    //     this._toast.show('支付成功')
                    // }else {
                    //     this._toast.show('支付失败')
                    // }
                })
            }

        },(error)=>{
          console.log('error'+error)
          //   alert(error)
            this._toast.show(error)
        })
    }
    }
}
const styles=StyleSheet.create({
    zhif:{
       width:Contants.Screen.width,
       height:100,
        backgroundColor:'#FFFFFF',
        marginTop:20,
        flexDirection:'row',

    },
    fu:{
        flexDirection:'row',
        // alignItems:'center',
        // justifyContent:'center',
    },
    text:{
        color:'#2D2D2D',
        margin:20,
        fontSize:14
    },
    xie:{
        flexDirection:'column',
        // alignItems:'center',
        // marginLeft:20,
        marginBottom:26,
        height:50
    },
    input:{
        width:Contants.Screen.width-40,
        alignSelf:'center',
        // marginBottom:20
    },
    chong:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    zhi:{
        color:'white',
    },
    checkBox:{
        borderRadius:20,
        borderWidth:1,
        // borderColor:''
    },
    zhiftext:{
        fontSize:14,
        color:'#2D2D2D',
        marginLeft:10
    },
    bao:{
        flexDirection:'column',
        // alignItems:'center',
    },
    type:{
        flexDirection:'row',
        alignItems:'center',
        flex:1
    },
    charg:{
       flexDirection:'column',
        backgroundColor:'#FFFFFF',
    },
    heng:{
        // width:Contants.Screen.width,
        height:1,
        backgroundColor:"#E5E5E5",
        marginBottom:26,
        marginLeft:20,
        marginRight:20
    },

})