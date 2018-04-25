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
   RefreshControl,
    AppState,
    ScrollView,
    BackHandler,
    Platform,
    ActivityIndicator
} from 'react-native';
import ActionButton from 'react-native-action-button';
import comstyle from '../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../common/GConst'
import MyTimer from '../../common/MyTimer'

var TimerMixin=require('react-timer-mixin');

export default class MyOrder extends Component{
    mixins:[TimerMixin]
    constructor(props){
        super(props);
      this.state={
          // dataSource: new ListView.DataSource({
          //     rowHasChanged: (row1, row2) => row1 !== row2,
          // }),
          isEmpty:false,
          time:0,
          isRefreshing:false,
          id:[],
          title:'',
          totalpage:0,
          perpage:0,
          // dataArray:[],
          pageIndex:0,
          isLoading:false
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
        this.timer && clearInterval(this.timer);
     this.fetchDate(1)
        this.setState({
            isRefreshing:true
        })
    }
    fetchDate(page){
        postFetch(API.DaiSongOrderList,{pageNum:page,numPerPage:10},(result)=>{
            // alert(JSON.stringify(result))
            this.setState({
                isRefreshing:false
            })
            if(result.status==1){
                this.setState({
                    totalpage:result.page.totalCount
                })
                this.timer=setInterval(()=>{
                    this.setState({
                        time:this.state.time+1
                    })
                },1000)
                if(result.data==[] || result.data.length==0){
                    this.setState({
                        // isEmpty:true
                        title:'当前没有代送订单'
                    })
                }else if(page==1){
                    this.setState({
                        // dataSource:this.state.dataSource.cloneWithRows(result.data),
                        isEmpty:false,
                        id:result.data,
                        // dataArray:result.data,
                        perpage:result.data.length
                    })
                    // this.timer=setInterval(()=>{
                    //     this.setState({
                    //         time:this.state.time+1
                    //     })
                    // },1000)
                }else {
                   this.setState({
                       // dataArray:this.state.dataArray.concat(result.data),
                       // dataSource:this.state.dataSource.cloneWithRows(this.state.dataArray.concat(result.data)),
                       id:this.state.id.concat(result.data),
                       perpage:this.state.perpage+result.data.length,
                       isLoading:true
                   })

                }

            }

        },(error)=>{
            this.setState({
                isRefreshing:false
            })
        })
        AppState.addEventListener('change',this.handleAppState.bind(this));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
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

        // this._beginTimer();
        this.fetchDate(1)
    };

    render(){
      var contenview=null
        // contenview=()
    return(<View style={styles.contain}>




            <View style={styles.text}>
            <Text style={{fontSize:16}}>{this.state.title}</Text>
            </View>

       <ScrollView
           showsVerticalScrollIndicator={true}
           scrollEnabled={true}
           pagingEnabled={true}
           horizontal={false}
           automaticallyAdjustContentInsets={true}
           // onScroll={(e)=>{
           //
           // }}
           onScroll={this.renderFooter}
           refreshControl={
               <RefreshControl
                   refreshing={this.state.isRefreshing}
                   onRefresh={this._onRefresh.bind(this)}
               />
           }
       >
           {this.state.id.map((rowData,index)=>{
               rowData.countdownTime -= 1000;

               return( <View style={styles.con} key={index}>
                   <TouchableOpacity style={styles.listview} onPress={()=>{
                       this.props.navigation.navigate('DaiSongOrderDetail',{data:rowData.id})
                   }}>
                       <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                           <View style={{flexDirection:'column'}}>
                               <Image source={require('../../img/tools/daisong.png')} style={comstyle.maleft}/>
                           </View>
                           {/*<Image source={{uri:rowData.imlUrl}} style={{width:45,height:45,marginLeft:20}}/>*/}
                           <View style={styles.item}>
                               {/*<Text>{rowData.consignee}</Text>*/}
                               <Text>{rowData.merchantRestaurants&&rowData.merchantRestaurants.address}</Text>
                               {/*<Text>{rowData.deliveryType==0?'外送：立即配送':'到店'}</Text>*/}
                           </View>
                       </View>
                       {/*<Text>{MyTimer.formatSeconds(1,this.state.comdtime)}</Text>*/}
                       <View style={{flexDirection:'column',alignItems:'center',justifyContent:"flex-end",marginRight:20}}>
                           <Image source={require('../../img/order/bluequan.png')} style={{alignItems:'center',justifyContent:'center',alignSelf:'flex-end',}}>
                               <Text style={{color:'#459CF4',fontSize:10}}>{rowData.orderNumber==undefined?'0号':rowData.orderNumber+'号'}</Text>
                           </Image>
                           <Text style={{color:'#B2B2B2',fontSize:10}}>{rowData.countdownTime<0?

                               (MyTimer.formatSeconds(2,-(rowData.countdownTime/1000))):(MyTimer.formatSeconds(2,(rowData.countdownTime/1000)))}</Text>
                       </View>
                       {/*<Text onPress={this.jiedan.bind(this,rowData.id)}>{rowData.id}</Text>*/}
                       {/*<Text>{this.state.ids}</Text>*/}
                   </TouchableOpacity>
                   <View style={comstyle.heng}/>
               </View>)
           })}
       </ScrollView>

    </View>)
}
    renderFooter=()=>{
        // alert(this.state.totalpage)
       if(this.state.totalpage==this.state.perpage){
           return(<View style={styles.loadingMore}>
               <Text style={styles.loadingText}>没有更多数据啦...</Text>
           </View>)
       }else {
           this.setState({
               pageIndex:this.state.pageIndex+1,
               isLoading:true
           })
           this.fetchDate(this.state.pageIndex+1)
           return(<ActivityIndicator style={styles.loadingMore}/>)
       }
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

    renderRow(rowData,sectionID,rowID){

    //     rowData.countdownTime -= 1000;
    //
    // return( <View style={styles.con}>
    //     <TouchableOpacity style={styles.listview} onPress={()=>{
    //         this.props.navigation.navigate('DaiSongOrderDetail',{data:rowData.id})
    //     }}>
    //     <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
    //         <View style={{flexDirection:'column'}}>
    //             <Image source={require('../../img/tools/daisong.png')} style={comstyle.maleft}/>
    //         </View>
    //         {/*<Image source={{uri:rowData.imlUrl}} style={{width:45,height:45,marginLeft:20}}/>*/}
    //         <View style={styles.item}>
    //             {/*<Text>{rowData.consignee}</Text>*/}
    //             <Text>{rowData.merchantRestaurants&&rowData.merchantRestaurants.address}</Text>
    //             {/*<Text>{rowData.deliveryType==0?'外送：立即配送':'到店'}</Text>*/}
    //         </View>
    //     </View>
    //     {/*<Text>{MyTimer.formatSeconds(1,this.state.comdtime)}</Text>*/}
    //     <View style={{flexDirection:'column',alignItems:'center',justifyContent:"flex-end",marginRight:20}}>
    //         <Image source={require('../../img/order/bluequan.png')} style={{alignItems:'center',justifyContent:'center',}}>
    //             <Text style={{color:'#459CF4',fontSize:10}}>{rowData.orderNumber+'号'}</Text>
    //         </Image>
    //         <Text>{rowData.countdownTime<0?
    //
    //             (MyTimer.formatSeconds(2,-(rowData.countdownTime/1000))):(MyTimer.formatSeconds(2,(rowData.countdownTime/1000)))}</Text>
    //     </View>
    //     {/*<Text onPress={this.jiedan.bind(this,rowData.id)}>{rowData.id}</Text>*/}
    //     {/*<Text>{this.state.ids}</Text>*/}
    //     </TouchableOpacity>
    // <View style={comstyle.heng}/>
    // </View>)
    }
    // componentWillUnmount() {
    //     this.timer && clearInterval(this.timer);
    //     // AppState.removeEventListener('change', this.handleAppState.bind(this));
    // }
}
const styles=StyleSheet.create({
  contain:{
      backgroundColor:'#f9f9f9',
      flex:1
  },
    listview:{
        flexDirection:'row',
        justifyContent:'space-between',
        height:60,
        marginTop:10,
        alignItems:'center',
        backgroundColor:'white',
    },
    item:{
        flexDirection:'column',
        marginLeft:10,
        alignItems:'center',
    },
    con:{
        flexDirection:'column',

    },
    text:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,
        position:'absolute',
        marginLeft:100
    },
    loadingMore: {
        marginVertical: 20,
        flexDirection:'row',
        justifyContent:'center'
    },
    loadingText: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
        marginTop:20
    },
})