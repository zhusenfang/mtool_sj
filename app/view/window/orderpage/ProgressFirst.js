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
    FlatList,
    RefreshControl,
    ScrollView,
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
import comstyle from '../../../common/CommonStyle'
var TimerMixin=require('react-timer-mixin');

var navigation=null
export default class ProgressFirst extends Component {
    mixins:[TimerMixin]
    constructor(props){
        super(props);

        this.state={
            datas:0,

            title:'',
            // dataSource: new ListView.DataSource({
            //     rowHasChanged: (row1, row2) => row1 !== row2,
            // }),
            // system:theTime2+':'+theTime1+':'+theTime,

            id:[],//订单id
            // ids:'',
            // time:'',
            isRefreshing:false,
            totalpage:0,
            perpage:0,
            // dataArray:[],
            pageIndex:0,
            isLoading:false
        }
        this.pageX='',
            this.pageY=''
        // this.data=[]
        navigation=this.props.navigation
        // alert(JSON.stringify(navigation))
    }
    componentWillMount(){
        this.timer && clearInterval(this.timer);
        //开始预约计时rowan

        this.setState({
            isRefreshing:true
        })
        // this.timer && clearInterval(this.timer);
        this.fetchDate(1);

    }

    fetchDate(page){
        var temthis=this;

        postFetch(API.OrderSec,{orderDining:{status:1,diningType:0},pageNum:page,numPerPage:10},(result)=>{
             // alert(JSON.stringify(result))

            this.setState({
                isRefreshing:false
            })
            this.timer && clearInterval(this.timer);
            if(result.status==1){
                this.setState({
                    totalpage:result.page.totalCount
                })
                this.timer = setInterval(()=>{

                    this.setState({
                        datas:this.state.datas-1
                    })
                    // alert(this.state.datas)

                },1000)
                // var letall=result.data
                if(result.data==[] || result.data.length==0){

                    this.setState({
                        title:'当前没有进行中订单记录',
                    })
                }else if(page==1){
                    this.setState({
                        // dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(result.data))),
                        id:result.data,
                        title:'',
                        perpage:result.data.length
                        // callMsg:result.data.length
                    })
                }else {
                    this.setState({
                        id:this.state.id.concat(result.data),
                        perpage:this.state.perpage+result.data.length,
                        isLoading:true,

                    })
                }
            }
        },(error)=>{
            // alert(error)
            this.setState({
                isRefreshing:false
            })
        })
        AppState.addEventListener('change',this.handleAppState.bind(this));
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
        AppState.removeEventListener('change', this.handleAppState.bind(this));
    }
    handleAppState(nextAppState) {
        if (nextAppState === 'inactive') {
            this.recodTime = new Date();
            this._endTimer();
        } else if (nextAppState === 'active') {

            this.turnsOnTimer();
        }
    }
    _endTimer(){

        this.timer && clearInterval(this.timer)

    }
    turnsOnTimer(){

        const now = new Date();
        const diff = Math.round((now - this.recodTime) / 1000);

        this.count = this.count+diff;

        this.fetchDate();

    };

    render(){
        var contentView=null;

        return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
            <View style={styles.text}>
                <Text>{this.state.title}</Text>

            </View>

            {/*<ListView*/}
                {/*dataSource={this.state.dataSource}*/}
                {/*renderRow={this._renderRow}*/}

                {/*refreshControl={*/}
                    {/*<RefreshControl*/}
                        {/*refreshing={this.state.isRefreshing}*/}
                        {/*onRefresh={this._onRefresh.bind(this)}*/}
                    {/*/>*/}
                {/*}*/}
            {/*/>*/}
            <ScrollView
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                pagingEnabled={true}
                horizontal={false}
                onScroll={this.renderFooter}
                automaticallyAdjustContentInsets={true}
                onTouchStart={(e)=>{
                    this.pageX=e.nativeEvent.pageX;
                    this.pageY=e.nativeEvent.pageY
                }}
                // onTouchMove={(e)=>{
                //     if(Math.abs(this.pageY-e.nativeEvent.pageY)>Math.abs(this.pageX-e.nativeEvent.pageX)){
                //         this.props.lockSlide();
                //     }else {
                //         this.props.openSlide();
                //     }
                // }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }>
                {this.state.id.map((rowData,index)=>{
                    rowData.countdownTime-=1000
                    //
                    // if((MyTimer.formatSeconds(1,(rowData.currentTime-rowData.createTime)/1000))==0){
                    //     alert("sss")
                    // }
                    // if(rowData.countdownTime==0){
                    //     alert("ssssss")
                    // }
                    // var i =  rowData.countdownTime/1000;
                    // var j = MyTimer.formatSeconds(2,i)
                    return(
                        <View style={{flexDirection:'column'}} key={index}>
                            <TouchableOpacity style={styles.listview} onPress={this.select.bind(this,rowData)}>
                                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                    <View style={{flexDirection:'column'}}>
                                        <Image source={require('../../../img/order/lanshutiao.png')}/>
                                    </View>
                                    <Image source={{uri:rowData.imlUrl}} style={{width:45,height:45,marginLeft:20,borderRadius:4}}/>
                                    <View style={styles.item}>
                                        {/*<Text>{rowData.consignee}</Text>*/}
                                        <Text style={{fontSize:14,color:'#282828',marginBottom:2.5}}>{rowData.orderName}</Text>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{fontSize:10,color:'#B2B2B2',marginTop:2.5}}>{rowData.diningType==0?'外送：':'到店：'}</Text>
                                            <Text style={{fontSize:10,color:'#B2B2B2',marginTop:2.5}}>{rowData.deliveryType==0?'立即配送':'预定'}</Text>
                                        </View>
                                    </View>
                                </View>
                                {/*<Text>{MyTimer.formatSeconds(1,this.state.comdtime)}</Text>*/}
                                {/*<View style={{flex:1}}/>*/}
                                <View style={{flexDirection:'row',justifyContent:"flex-end"}}>
                                <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',}}>
                                    {/*<View style={{flex:1}}/>*/}
                                    <Image source={require('../../../img/order/bluequan.png')} style={{marginRight:20,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'}}>
                                        <Text style={{color:'#459CF4',fontSize:10}}>{rowData.orderNumber==undefined?'0号':rowData.orderNumber+'号'}</Text>
                                    </Image>
                                    {/*<Text style={{marginRight:20}}>{(rowData.countdownTime)<0?*/}

                                    {/*MyTimer.formatSeconds(1,-((rowData.countdownTime/1000))):MyTimer.formatSeconds(1,(rowData.countdownTime)/1000)}</Text>*/}
                                    {/*<Text>{i+"-"+j}</Text>*/}
                                    <Text style={{marginRight:20,fontSize:10,color:'#FF305E'}}>{rowData.countdownTime<0?MyTimer.formatSeconds(2,-(rowData.countdownTime/1000)):MyTimer.formatSeconds(2,rowData.countdownTime/1000)}</Text>

                                </View>
                                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',}}>
                                        <Image source={require('../../../img/window/press.png')} style={{marginRight:20}}/>
                                    </View>

                                </View>
                                {/*<Text onPress={this.jiedan.bind(this,rowData.id)}>{rowData.id}</Text>*/}
                                {/*<Text>{this.state.ids}</Text>*/}

                            </TouchableOpacity>
                            <View style={comstyle.heng}/>
                        </View>
                    )
                })}
            </ScrollView>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)
    }
    _onRefresh(){
        this.setState({
            isRefreshing:true,
            id:[],
            pageIndex:1
        })
        this.timer && clearInterval(this.timer);
         this.fetchDate(1);
    }
    renderFooter=()=>{
        // alert(this.state.totalpage)
        if(this.state.totalpage==this.state.perpage){
            return(<View style={comstyle.loadingMore}>
                <Text style={comstyle.loadingText}>没有更多数据啦...</Text>
            </View>)
        }else {
            this.setState({
                pageIndex:this.state.pageIndex+1,
                isLoading:true
            })
            this.fetchDate(this.state.pageIndex+1)
            return(<ActivityIndicator style={comstyle.loadingMore}/>)
        }
    }
    // _renderRow=(rowData,sectionID,rowID)=>{
    //     // this.setState({
    //     //     isRefreshing:true
    //     // })
    //     // this.fetchDate();
    //     // alert(this.state.datas)
    //
    //     rowData.countdownTime-=1000
    //     //
    //     // if((MyTimer.formatSeconds(1,(rowData.currentTime-rowData.createTime)/1000))==0){
    //     //     alert("sss")
    //     // }
    //     // if(rowData.countdownTime==0){
    //     //     alert("ssssss")
    //     // }
    //     var i =  rowData.countdownTime/1000;
    //     // var j = MyTimer.formatSeconds(2,i)
    //     return(
    //    <View style={{flexDirection:'column'}}>
    //         <TouchableOpacity style={styles.listview} onPress={this.select.bind(this,rowData)}>
    //             <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
    //                 <View style={{flexDirection:'column'}}>
    //                     <Image source={require('../../../img/order/lanshutiao.png')}/>
    //                 </View>
    //                 <Image source={{uri:rowData.imlUrl}} style={{width:45,height:45,marginLeft:20,borderRadius:4}}/>
    //                 <View style={styles.item}>
    //                     {/*<Text>{rowData.consignee}</Text>*/}
    //                     <Text>{rowData.orderName}</Text>
    //                     <Text>{rowData.deliveryType==0?'外送：立即配送':'到店'}</Text>
    //                 </View>
    //             </View>
    //             {/*<Text>{MyTimer.formatSeconds(1,this.state.comdtime)}</Text>*/}
    //             <View style={{flexDirection:'column',alignItems:'center',justifyContent:"flex-end"}}>
    //                 <Image source={require('../../../img/order/bluequan.png')} style={{marginRight:20}}>
    //                     <Text style={{color:'#459CF4',fontSize:10,marginLeft:5,marginTop:5}}>{rowData.orderNumber+'号'}</Text>
    //                 </Image>
    //                 {/*<Text style={{marginRight:20}}>{(rowData.countdownTime)<0?*/}
    //
    //                 {/*MyTimer.formatSeconds(1,-((rowData.countdownTime/1000))):MyTimer.formatSeconds(1,(rowData.countdownTime)/1000)}</Text>*/}
    //                 {/*<Text>{i+"-"+j}</Text>*/}
    //                 <Text style={{marginRight:20}}>{rowData.countdownTime<0?MyTimer.formatSeconds(2,-(rowData.countdownTime/1000)):MyTimer.formatSeconds(2,rowData.countdownTime/1000)}</Text>
    //             </View>
    //             {/*<Text onPress={this.jiedan.bind(this,rowData.id)}>{rowData.id}</Text>*/}
    //             {/*<Text>{this.state.ids}</Text>*/}
    //
    //         </TouchableOpacity>
    //        <View style={comstyle.heng}/>
    //    </View>
    //     )
    //
    //
    // }
    jiedan(rowData){
        // postFetch(API.JieDan,{orderDining:{
        //     id:rowData,
        //     status:'1'
        // }},(result)=>{
        //     alert(JSON.stringify(result))
        //     if(result.status==1){
        //         this._toast.show('接单成功')
        //     }
        // })
    }

    select(rowData){
        // alert(rowData.id.toString())
        // alerthistles
        //  alert('sss')

        this.props.navigation.navigate('DaoOrderDetail',{data:JSON.stringify(rowData.id)})
        // alert(JSON.stringify(rowData.id))
    }
}
const styles=StyleSheet.create({
    contain:{
        flex:1
    },
    text:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,
        position:'absolute',
        marginLeft:100
    },
    listview:{
        flexDirection:'row',
        justifyContent:'space-between',
        height:60,
        marginTop:10,
        // alignItems:'center',
        backgroundColor:'#FFFFFF'

    },
    item:{
        flexDirection:'column',
        marginLeft:10
    }
})