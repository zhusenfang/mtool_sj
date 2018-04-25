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
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TextInput,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Contants from '../../../common/Contants'
import TabBar from '../../../common/DfyTabBar'
import DongTaiFirst from './DongTaiFirst'
import DongTaiPing from './DongTaiPing'
import CommonModal from '../../CommonPage/ComonModal'
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import CheckBox from '../../../common/CheckView'
export default class BianJiBiaoQian extends Component{
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            list:[]
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }

    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        const list=this.props.navigation.state.params.data;
        postFetch(API.BiaoQianXiaUser,{labelId:list},(reulst)=>{
          // alert(JSON.stringify(reulst))
            if(reulst.status==1){
              this.setState({
                  dataSource:this.state.dataSource.cloneWithRows(reulst.data),
                  list:reulst.data
              })
            }
        })
    }
    render(){
        return(<View style={[comstyle.con,{flexDirection:'column'}]}>
           <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={this.tianjia.bind(this)}>
               <View style={comstyle.rightview}>
                   <Image source={require('../../../img/pinglun/tianjiafriend.png')} style={comstyle.maleft}/>
                   <Text style={styles.text}>添加新成员</Text>
               </View>
               <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
           </TouchableOpacity>
            <View style={comstyle.heng}/>
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderImage}
            enableEmptySections={true}
            style={styles.listview}
            />
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)
    }
    tianjia(){
        const list=this.props.navigation.state.params.data;
        this.props.navigation.navigate('AddNewFirend',{data:list})
    }
    renderImage=(rowData,sectionID,rowID)=>{
        return(<View style={styles.cons}>
            <View style={styles.rightv}>
                <View style={comstyle.rightview}>
                    <Image source={{uri:rowData.picUrl}} style={styles.iamge}/>
                    <Text style={styles.text}>{rowData.name}</Text>
                </View>
                <TouchableOpacity onPress={this.delect.bind(this,rowData,rowID)}>
               <Image source={require('../../../img/pinglun/chaunpress.png')} style={comstyle.textright}/>
                </TouchableOpacity>
            </View>
            <View style={comstyle.heng}/>
        </View>)
    }
    delect(rowdata,rowid){
        const list=this.props.navigation.state.params.data;
      postFetch(API.DelectBiaoQainUser,{labelId:list,memId:[rowdata.id]},(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
              delete this.state.list[rowid]
              this.setState({
                  dataSource:this.state.dataSource.cloneWithRows(this.state.list)
              })
              this._toast.show(result.msg)
          }
      })
    }
}
const styles=StyleSheet.create({
    cons:{
        flexDirection:'column',
        marginTop:6
    },
    rightv:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        height:60
    },
    iamge:{
        width:45,
        height:45,
        marginLeft:20,
        borderRadius:4
    },
    text:{
        fontSize:14,
        color:'#282828',
        marginLeft:9
    },
    listview:{
        marginTop:10
    }
})