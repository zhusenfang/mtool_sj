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
import Contants from '../../../common/Contants'
import CommonModal from '../../CommonPage/ComonModal'
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import CheckBox from '../../../common/CheckView'
var navigation=null
export default class PingBiManage extends Component{
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled: false,

    })
    constructor(props){
        super(props)
        this.state={
            k:[],
            destlist:[],
            list:[],
            isDui:false,
            listid:[],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
        navigation=this.props.navigation
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

    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        // this.props.navigation.setParams({
        //     clickLeftBtn: this._clickLeftBtn.bind(this),
        //     // clickRightBtn: this._clickRightBtn.bind(this)
        // });


        postFetch(API.PingBiManage,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                var map = {},
                    dest = [];
                for(var i = 0; i < result.data.length; i++){
                    this.setState({
                        k:result.data
                    })
                    var ai = result.data[i];
                    if(!map[ai.charAlpha]){
                        dest.push({
                            charAlpha: ai.charAlpha,
                            // name: ai.name,
                            data: [ai]
                        });
                        map[ai.charAlpha] = ai;
                    }else{
                        for(var j = 0; j < dest.length; j++){
                            var dj = dest[j];
                            if(dj.charAlpha == ai.charAlpha){
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }
                // b=dest
                this.setState({
                    destlist:dest,

                })

            }
        })
    }
    onBackpress(){
        if(this.state.isDui==false){
            this.props.navigation.goBack()
        }else {
            postFetch(API.PingBiManageLaChu,{hxNames:this.state.listid},(result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    this._toast.show(result.msg)
                }
            },(error)=>{
                alert(error)
            })
        }
    }
    render(){
        return(<View style={comstyle.con}>
            <CommonModal style={{position:'absolute', zIndex:1000,}} navigation={navigation}/>
            <View  style={styles.headerContainer}>
                {/*内容*/}
                <Text allowFontScaling={false} style={styles.middleTitle}>
                    屏蔽管理
                </Text>

                {/*左边返回按钮*/}
                <TouchableOpacity style={styles.leftImgBtn} onPress={this.onBackpress.bind(this)}>
                    <Image source={this.state.isDui==false?require("../../../img/page/arrow.png"):require('../../../img/window/press.png')}/>
                </TouchableOpacity>


                {/*<View style={styles.leftImgBtn}/>*/}

            </View>
            <SectionList
                ref='sectionList'
                renderSectionHeader={this.sectionComp}
                // dataSource={this.state.dataSource}
                renderItem={this._renderRow}
                sections={this.state.destlist}
                keyExtractor={ (item) => item.name }
                // scrollToIndex={()=>{}}
                // onViewableItemsChanged = {(info)=>this.itemChange(info)}  //滑动时调用
            />
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderImage}
                enableEmptySections={true}
                horizontal={true}
            />
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)
    }
    renderImage=(rowData)=>{
        return(<View style={styles.maimage}>
            <Image source={{uri:rowData.picUrl}} style={styles.rowimages}/>
        </View>)
    }
    _renderRow=(rowData,sectionID,rowID,highlightRow)=>{
        // alert(JSON.stringify(rowData))
        return(
            <View style={{flexDirection:'column'}}>
                <View style={{flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                    backgroundColor:'white',
                    height:60,marginTop:10}}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <Image source={{uri:rowData.item.picUrl}} style={{width:45,height:45,marginLeft:20,borderRadius:4}}/>
                        <Text style={{marginLeft:10}}>{rowData.item.nickname}</Text>
                    </View>
                    <CheckBox onChange={this._change.bind(this,rowData.item)} style={{marginRight:20}}/>
                </View><View style={comstyle.heng}/>
            </View>)
    }
    sectionComp=(info)=>{
        // alert(JSON.stringify(info))
        return(<Text style={{fontSize:14,marginLeft:20,marginTop:15,marginBottom:10,color:"#282828"}}>{info.section.charAlpha}</Text>)
    }
    _change(info){
        // alert(JSON.stringify(this.state.imgurls))

        var dou=false
        for (var i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i] == info) {
                dou=true

            }
        }
        if(!dou){
            this.state.list.push(info)
            this.state.listid.push(info.hxUsername)
            // this.setState({
            //     isDui:true
            // })
        }else {
            for (var i = 0; i < this.state.list.length; i++) {
                if (this.state.list[i] == info) {
                    this.state.list.splice(i,1)
                    this.state.listid.splice(i,1)
                    // this.setState({
                    //     isDui:false
                    // })
                }
            }
        }
        if(this.state.list==[]){
            this.setState({
                isDui:false
            })
        }else {


        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.list))),
            isDui:true
        })
        }
    }
}
const styles=StyleSheet.create({
    she:{
        position:'absolute',
        marginTop:75,
        alignSelf:'flex-end',
        zIndex:100
    },
    //导航栏样式
    headerContainer: {

        height: 60,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 0,
        width: "100%",
        marginTop:0

    },

    leftImgBtn: {
        width: 105,
        height: 55,
        alignItems: "flex-end",
        justifyContent: "center",
        // marginLeft:Contents.Screen.width/3+30,
        // position:'absolute',
        alignSelf:'flex-end',
        marginRight:Contants.Screen.width/6+25.5,
    },

    middleTitle: {

        fontSize: 18,
        marginLeft:20,
    },
    rowimages:{
        width:45,
        height:45,
        marginLeft:5
    },
    maimage:{
        marginLeft:15,
    }
})