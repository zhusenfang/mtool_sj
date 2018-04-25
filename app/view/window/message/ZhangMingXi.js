import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    ListView,
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Toast from "react-native-easy-toast";
export default class ZhangMingXi extends Component{
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentDidMount() {
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        postFetch(API.ZhangHuMingxi,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data)
                })
            }
        },(error)=>{
        this._toast.show(error)
        })
    }
    render(){
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            <Text style={styles.text}>本月</Text>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
            />
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)
    }
    _renderRow=(rowData)=>{
        var showday=new Array('周一','周二','周三','周四','周五','周六','周日')
        // alert(showday[new Date(rowData.createTime).getDate()-1])
        var time=new Date(rowData.createTime).getDate()
        // alert(JSON.stringify(new Date(rowData.createTime).getDay()))
        return(<TouchableOpacity style={styles.list} onPress={()=>{this.props.navigation.navigate('TodayDetail',{data:rowData.id})}}>
             <View style={styles.item}>
               <View style={comstyle.colitem}>
                   <Text style={styles.zhou}>{showday[new Date(rowData.createTime).getDay()-1]}</Text>
                   <View style={{flexDirection:'row',alignItems:'center',marginLeft:20}}>
                   <Text style={styles.sex}>{new Date(rowData.createTime).getMonth()+1+'-'}</Text>
                       <Text style={styles.sex}>{new Date(rowData.createTime).getDate()}</Text>
                   </View>
               </View>
                 <View style={comstyle.colitem}>
                     <View style={{flexDirection:'row',alignItems:'center',marginLeft:20}}>
                     <Text style={[styles.fu,{color:rowData.changeDirection==0?'#FF305E':'#33BAB2'}]}>{rowData.changeDirection==0?'+':"-"}</Text>
                     <Text style={[styles.fu,{color:rowData.changeDirection==0?'#FF305E':'#33BAB2'}]}>{rowData.quantity}</Text>
                     </View>
                     <Text style={styles.waimai}>{rowData.changeReason}</Text>
                 </View>
                 <View style={{flex:1}}/>
                 <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
             </View>
            <View style={comstyle.heng}/>
        </TouchableOpacity>)
    }
}
const styles=StyleSheet.create({
    text:{
        fontSize:14,
        color:'#282828',
        marginTop:30,
        marginLeft:20,
        marginBottom:20

    },
    list:{
        flexDirection:'column',

    },
    item:{
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        height:60,
        backgroundColor:'white'

    },
    zhou:{
        fontSize:14,
        color:'#282828',
        marginLeft:20
    },
    sex:{
        color:'#B2B2B2',
        fontSize:10,

    },
    fu:{
       fontSize:18,
       // color:'#33BAB2',

    },
    waimai:{
        fontSize:10,
        color:'#282828',
        marginLeft:20
    }
})