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
    StatusBar,
    DeviceEventEmitter,
    BackHandler
} from 'react-native';
import Contants from '../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../common/DfyTabBar'
import {API,postFetch} from '../../common/GConst'
import Toast from "react-native-easy-toast";

import {Container, Tab, Tabs,TabHeading} from 'native-base';

import ChatView from '../window/news/ChatView'
import Storage from '../../common/GGAsyncStorage'
var navigation=null
import comstyle from '../../common/CommonStyle';
var id=''
export default class HeXiaoNews extends Component {
    constructor(props){
        super(props)
        this.state={
            hxid:'',
            message:'',
            cell:true,
            tags:'',
            chat:true,
            json:''
        }
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled: false,

    })

    componentWillMount(){

    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        postFetch(API.TotalHuifu,null,(result)=>{
            this.setState({
                json:JSON.stringify(result).toString()
            })
        })
        Storage.get("userId").then((tagss)=>{

            this.setState({
                tags:tagss
            })
        })
        this.subscription=  DeviceEventEmitter.addListener('event',this.onResult)

    }
    onResult=(e)=>{

        if(e.action === "LOADED"){
            // const list=this.props.navigation.state.params.data;
            // alert("hxId:"+list);
            // this._MapView.initChatView(list,1)
            if(this.state.cell){
                this.setState({
                    cell:false
                })
                const list=this.props.navigation.state.params.data;
                if(list==null) {
                    const lists=this.props.navigation.state.params.datas;
                    const s=lists.substring(81)
                    postFetch(API.HeXiaoDetail,{orderDining:{
                        headingCode:s
                    }}, (result) => {
                        if (result.status == 1) {
                            // alert(JSON.stringify(result.data.hxGroupId))
                            this.setState({
                                hxid: result.data.hxGroupId
                            })
                            this._MapView.initChatView(result.data.hxGroupId.toString(), 2)
                        }
                    }, (error) => {
                        alert(error)
                    })
                }else {
                    postFetch(API.HeXiaoDetail,{orderDining:{
                        headingCode:list
                    }}, (result) => {
                        if (result.status == 1) {
                            // alert(JSON.stringify(result.data.hxGroupId))
                            this.setState({
                                hxid: result.data.hxGroupId
                            })
                            this._MapView.initChatView(result.data.hxGroupId.toString(), 2)
                        }
                    }, (error) => {
                        alert(error)
                    })
                }

            }
        }else if(e.action==='TO_USER_DETAIL'){
            if(this.state.tags===this.state.hxid){
                this.props.navigation.navigate('MessageMain')
            }else {
                this.props.navigation.navigate('UserDetails',{hxid:this.state.hxid})
            }
        }else  if(e.action==='QUICK_REPLY'){
            if(this.state.chat){
                this.setState({
                    chat:false
                })
                this._MapView.setQuickReply(this.state.json)
            }
        }

    }
    componentWillUnmount(){
        // DeviceEventEmitter.addListener('event',this.onResult).remove()
        //  DeviceEventEmitter.removeAllListeners()
        this.subscription.remove();
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }
    render(){

        return(<View style={comstyle.con}>

            {/*<ComonModal style={{position:'absolute', zIndex:1000,}} navigation={navigation} selected={true} action={this.surebut.bind(this)}/>*/}

            {/*<View  style={styles.headerContainer}>*/}
            {/*/!*内容*!/*/}
            {/*<Text allowFontScaling={false} style={styles.middleTitle}>*/}
            {/*消  息*/}
            {/*</Text>*/}

            {/*/!*左边返回按钮*!/*/}
            {/*<TouchableOpacity style={styles.leftImgBtn} onPress={()=>{this.props.navigation.goBack()}}>*/}
            {/*<Image source={require("../../../img/page/arrow.png")}/>*/}
            {/*</TouchableOpacity>*/}
            {/*<View style={styles.leftImgBtn}/>*/}

            {/*</View>*/}
            <View style={{width:Contants.Screen.width,height:Contants.Screen.height-60-StatusBar.currentHeight}}>
                <ChatView style={{width:Contants.Screen.width,height:Contants.Screen.height}}
                          ref={ component => this._MapView = component }
                />
            </View>
        </View>)

    }

}
