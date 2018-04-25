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
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import MyTimer from '../../../common/MyTimer'
import comstyle from '../../../common/CommonStyle'
var TimerMixin=require('react-timer-mixin');

var navigation=null
export default class YiChangOrder extends Component {
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        postFetch(API.YiChangOrder,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
               dataSource:this.state.dataSource.cloneWithRows(result.data)
                })
            }
        })
    }
    render(){
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                enableEmptySections={true}
            />
        </View>)
    }
    _renderRow=(rowData)=>{
        return(<View style={yichangstyle.item}>
            <View style={comstyle.rightview}>
                <Image source={{uri:rowData.imlUrl}} style={{width:45,height:45,borderRadius:5,marginLeft:20}}/>
                <View style={yichangstyle.items}>
                    {/*<Text>{rowData.consignee}</Text>*/}
                    <Text style={comstyle.text}>{rowData.orderName}</Text>

                </View>

            </View>

            <View style={yichangstyle.timeview}>
                <Text style={yichangstyle.apptime}>{new Date(rowData.createTime).getFullYear()+'-'}</Text>
                <Text style={yichangstyle.apptime}>{new Date(rowData.createTime).getMonth()+1+'-'}</Text>
                <Text style={yichangstyle.apptime}>{new Date(rowData.createTime).getDate()}</Text>
            </View>
        </View>)
    }
}
const yichangstyle=StyleSheet.create({
    item:{
        flexDirection:'row',
        width:Contants.Screen.width,
        justifyContent:'space-between',
        backgroundColor:'white',
        height:60,
        alignItems:'center',
        marginTop:10
    },
    tao:{
        flexDirection:'column',
        justifyContent:'flex-start'
    },
    text:{
        marginLeft:10,
        marginRight:10
    },
    items:{
        flexDirection:'column',
        alignItems:"center",
        marginLeft:10
    },
    timeview:{
        justifyContent:'flex-end',
        flexDirection:'row',
        marginRight:20
    },
    apptime:{
        fontSize:10,
        color:'#B2B2B2',
        // marginRight:20
        fontFamily:'FZLTXHK--GBK1-0',
        letterSpacing:0.01,
        lineHeight:10
    },
})