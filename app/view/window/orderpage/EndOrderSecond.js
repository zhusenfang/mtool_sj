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
    AppState
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
var TimerMixin=require('react-timer-mixin');

// var comdtime=600;
var uptime=1;
var theTime = 0;//秒
var theTime1 = 0;//分
var theTime2 = 0;//时
export default class EndOrderSecond extends Component {
    mixins:[TimerMixin]
    constructor(props){
        super(props);

        this.state={
            isshow:false,
            title:'',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            system:theTime2+':'+theTime1+':'+theTime,
            comdtime:6,
            id:[],//订单id
            ids:''
        }
        navigation=this.props.navigation
        // alert(JSON.stringify(navigation))
    }
    componentDidMount(){
        this.timer && clearInterval(this.timer);
        //开始预约计时rowan

        this.timer = setInterval(()=>{
            if(this.state.comdtime==0){
                this.timer && clearInterval(this.timer);
                // alert(this.state.dataSource)
                // var s=this.state.dataSource.

                //  alert(JSON.stringify(this.state.dataSource))
            }
            if(this.state.comdtime>0 ){
                this.setState({
                    comdtime:this.state.comdtime-1
                })

            }

        },1000)
        postFetch(API.Order,{orderDining:{status:2,diningType:1}},(result)=>{
            alert(JSON.stringify(result))
            if(result.status==1){
                if(result.data==[] || result.data.length==0){

                    this.setState({
                        title:'当前没有待处理订单记录',
                    })
                }else {
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(result.data),
                        id:result.data
                    })
                    // alert(JSON.stringify(this.state.id))
                }
            }
        },(error)=>{
            alert(error)
        })


    }
    render(){
        var contentView=null;

        return(<View style={[{flex:1,backgroundColor:'#f9f9f9'}]}>
            <View style={styles.text}>
                <Text>{this.state.title}</Text>

            </View>

            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                // renderRow={(rowData)=>{
                //     return(
                //         <TouchableOpacity style={styles.listview} onPress={this.select.bind(this)}>
                //             <View style={styles.item}>
                //                 <Text>{rowData.consignee}</Text>
                //                 <Text>{rowData.deliveryType==0?'外送：立即配送':'到店'}</Text>
                //             </View>
                //             <Text>{MyTimer.formatSeconds(1,this.state.comdtime)}</Text>
                //
                //             <Text>{rowData.id}</Text>
                //             {/*<Text>{this.state.ids}</Text>*/}
                //         </TouchableOpacity>
                //     )
                // }}
            />
        </View>)
    }
    _renderRow=(rowData)=>{
        const {navigate}=this.props.navigation;
        // if(this.state.comdtime==0){
        //
        //     postFetch(API.chaoshi,{orderDining:{id:rowData.id}},(result)=>{
        //
        //         if(result.status==1){
        //           this.setState({
        //               ids:'拒单'
        //           })
        //         }
        //     },(error)=>{
        //         alert(error)
        //     })
        // }
        // alert(JSON.stringify(rowData.id))
        return(

            <TouchableOpacity style={styles.listview} onPress={this.select.bind(this,rowData)}>
                <View style={styles.item}>
                    <Text>{rowData.consignee}</Text>
                    <Text>{rowData.deliveryType==0?'外送：立即配送':'到店'}</Text>
                </View>
                <Text>{MyTimer.formatSeconds(1,this.state.comdtime)}</Text>

                <Text>{rowData.id}</Text>
                <Text>{this.state.ids}</Text>
            </TouchableOpacity>
        )

    }

    select(rowData){
        // alert(rowData.id.toString())
        // alerthistles
        //  alert('sss')
        this.props.navigation.navigate('OrderDetails',{data:JSON.stringify(rowData.id)})
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
        marginLeft:40
    },
    listview:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    item:{
        flexDirection:'column',
    }
})