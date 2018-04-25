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
    SectionList,
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
var  list=''
export default class QunManage extends Component{
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            text:''
        }
        list=this.props.navigation.state.params.data;
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
        postFetch(API.QunGuanLi,{groupId:list},(result)=>{
            // alert(JSON.stringify(result))
           if(result.status===1){
                this.setState({
                   dataSource:this.state.dataSource.cloneWithRows(result.data)
                })
           }

        },(error)=>{
            alert(error)
        })
    }
    render(){
        return(<View style={[comstyle.con,{flexDirection:'column'}]}>
            <View style={styles.gong}>
                <View style={styles.qun}>
                   <Text style={[comstyle.maleft,comstyle.text]}>群公告</Text>
                </View>
                <View style={comstyle.heng}/>
                <View style={styles.qun}>
                    <Text style={[comstyle.maleft,comstyle.text,comstyle.textright]}>深夜食堂</Text>
                </View>
                <View style={comstyle.heng}/>
            </View>
            {/*<View style={[comstyle.item,{marginTop:15}]}>*/}
                {/*<Text style={[comstyle.maleft,comstyle.text]}>退出该群</Text>*/}
            {/*</View>*/}
            {/*<View style={comstyle.heng}/>*/}
            {/*<View style={[comstyle.item,{marginTop:5}]}>*/}
                {/*<Text style={[comstyle.maleft,comstyle.text]}>举报该群</Text>*/}
            {/*</View>*/}
            {/*<View style={comstyle.heng}/>*/}
            <View style={styles.chuang}>
              {/*<View style={styles.member}>*/}
                  {/*<Text style={[comstyle.maleft,comstyle.text]}>7名成员 / </Text>*/}
                  {/*<Text style={comstyle.text}>{'创建人:'}</Text>*/}
              {/*</View>*/}
                <View style={comstyle.heng}/>
                <View style={styles.jia}>
                    {/*<View style={styles.che}>*/}
                        {/*<Image source={require('../../../img/window/jia.png')} style={comstyle.maleft}/>*/}
                        {/*<Text style={styles.text}>添加成员</Text>*/}
                    {/*</View>*/}
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderImg.bind(this)}
                        // horizontal={true}
                        // style={{height:50}}
                        enableEmptySections={true}
                        contentContainerStyle={styles.consty}
                    />
                </View>
            </View>
        </View>)
    }
    _renderImg(rowData,sectionID,rowID){
        return(<TouchableOpacity style={styles.conimg}>
            <Image source={{uri:rowData.picUrl}} style={{width:75,height:75,borderRadius:4}}/>
        </TouchableOpacity>)
    }
}
const styles=StyleSheet.create({
    gong:{
        flexDirection:'column',
        marginTop:15,
        justifyContent:'center',
    },
    qun:{
        // alignItems:'center',
        height:51,
        backgroundColor:'white',
        justifyContent:'center',
    },
    chuang:{
        marginTop:15,
        flexDirection:'column',
        backgroundColor:'white',
        // justifyContent:'center',
    },
    member:{
        flexDirection:'row',
        height:46,
        // justifyContent:'center',
        alignItems:'center',
    },
    jia:{
        flexDirection:'row',
         marginTop:15
    },
    consty:{
        flexWrap:'wrap',
        flexDirection:'row',
        backgroundColor:'white'
    },
    che:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    text:{
        fontSize:12,
        color:'#282828',
        marginTop:6,
       marginLeft:15
    },
    conimg:{
        // width:95,
        // height:95,
        alignItems:"center",
        justifyContent:'center',
        marginLeft:10,
        flexWrap:'wrap',
        flexDirection:'row',
        marginTop:5,
        marginBottom:5
    },

})