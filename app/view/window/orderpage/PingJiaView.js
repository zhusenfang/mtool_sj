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
    ActivityIndicator
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
var pagelists=[]
export default class PingJiaView extends Component {
    constructor(props){
        super(props)
        this.state={
          wuprice:'',
         service:'',
        content:'',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            dataSourcepj: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }
    componentWillMount(){
        const list=this.props.navigation.state.params.data;
        postFetch(API.OrderPingJai,{id:list},(result)=>{
            // alert(JSON.stringify(result.data))
            // alert(JSON.stringify(result.data.merchantRestaurantsComment))
            if(result.status==1){
                this.setState({
                 wuprice:result.data.merchantRestaurantsComment.score,
                    service:result.data.merchantRestaurantsComment.serverScore,


                })
                if(result.data.merchantRestaurantsComment.content!=undefined){
                    this.setState({
                        content:result.data.merchantRestaurantsComment.content,
                    })
                }
                if(result.data.merchantRestaurantsComment.merchantRestaurantsCommentImgs!=undefined){

                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(result.data.merchantRestaurantsComment.merchantRestaurantsCommentImgs)
                    })
                }
                if(result.data.foodCommentDo!=undefined){
                    // alert(JSON.stringify(result.data.foodCommentDo))
                    this.setState({
                        dataSourcepj:this.state.dataSourcepj.cloneWithRows(result.data.foodCommentDo)
                    })
                }
            }
        },(error)=>{

            this._toast.show(error)
        })
    }

    render(){
     var view=null;
     if(this.state.wuprice==0&&this.state.wuprice==undefined){
         view=(<View></View>)

     }
     if(this.state.wuprice==1){
         view=(<Image source={require('../../../img/order/wujiaox.png')}/>)

     }
     if(this.state.wuprice==2){
         view=(
             <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
             </View>)

     }
     if(this.state.wuprice==3){
         view=(
             <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
             </View>)

     }
     if(this.state.wuprice==4){
         view=(
             <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
             </View>)

     }
     if(this.state.wuprice==5){
         view=(
             <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                 <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
             </View>)
     }
        var views=null;
        if(this.state.service==0&&this.state.service==undefined){
            views=(<View></View>)

        }
        if(this.state.service==1){
            views=(<Image source={require('../../../img/order/wujiaox.png')}/>)

        }
        if(this.state.service==2){
            views=(
                <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                </View>)

        }
        if(this.state.service==3){
            views=(
                <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                </View>)

        }
        if(this.state.service==4){
            views=(
                <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                </View>)

        }
        if(this.state.service==5){
            views=(
                <View style={{flexDirection:'row',marginLeft:20}}><Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                    <Image source={require('../../../img/order/wujiaox.png')} style={comstyle.maleft}/>
                </View>)
        }
        // alert(JSON.stringify(list))
        return(<ScrollView style={styles.contain}>
              <View style={[styles.wu,{marginTop:20}]}>
                  <Text style={comstyle.maleft}>物美价廉</Text>
                  {view}
              </View>
            <View style={styles.wu}>
                <Text style={comstyle.maleft}>服务态度</Text>
                {views}
            </View>
            <View style={styles.wu}>
                <Text>{this.state.content==undefined?'':this.state.content}</Text>
            </View>
            <ListView
                // style={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                horizontal={true}
            />
            <View style={comstyle.heng}/>
            <View style={styles.pingj}>
                <Text style={comstyle.maleft}>商品评价</Text>
            </View>
            <View style={comstyle.heng}/>
            <ListView
             dataSource={this.state.dataSourcepj}
             renderRow={this._renderItem}
            />
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </ScrollView>)
    }
    _renderRow=(rowData)=>{
        // alert(JSON.stringify(rowData))
        return(<View style={{flexDirection:'row',flexWrap:'wrap'}}>
            <Image source={{uri:rowData.url}} style={{width:60,height:60,marginTop:10,marginLeft:10,marginRight:10}}/>
            {/*<Text>{rowData}</Text>*/}
        </View>)
    }
    _renderItem=(rowData)=>{
        alert(JSON.stringify(rowData))
        const ad=rowData.imagesUrl
        var str=new Array()
        if(ad!=undefined){
            str=ad.split(',')
            for(var i=0;i<str.length;i++){
                pagelists.push(<View style={{flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10,backgroundColor:'white',}}>
                  <Image key={i} source={{uri:str[i]}} style={{width:60,height:60,marginLeft:10,borderRadius:4}}/>
                </View>)
            }
        }
        return(<View style={styles.item}>
          <View style={styles.list}>
              <Image source={{uri:rowData.foodImg}} style={{width:60,height:60,marginTop:10,marginLeft:10,marginRight:10,borderRadius:4}}/>
              <Text>{rowData.name}</Text>
          </View>
            <Text>{rowData.content==undefined?'':rowData.content}</Text>
              <View style={{flexDirection:'row',marginBottom:10,flexWrap:'wrap',backgroundColor:'white'}}>
                  {pagelists}
              </View>
        </View>)
    }
}
const styles=StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    wu:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
         // marginTop:20,
        backgroundColor:'white',
        height:30,

    },
    pingj:{
        marginTop:10,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        // marginTop:20,
        backgroundColor:'white',
        height:40
    },
    item:{
        flexDirection:'column',
        backgroundColor:'white',

    },
    list:{
        justifyContent:'flex-start',
        flexDirection:'row',
        alignItems:'center',

    }

})