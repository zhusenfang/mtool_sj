import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    StatusBar,
    DeviceEventEmitter,
    Platform,
    KeyboardAvoidingView,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API, postFetch} from '../../../common/GConst';
import ChatView from './ChatView'
import Contants from '../../../common/Contants'
import LoginModule from '../../../view/nativeModuals/LoginModule'
import Storage from '../../../common/GGAsyncStorage'
import Contents from '../../../common/Contants'

var list = ''
var type = ''
var navigation = null
import ComonModal from '../../CommonPage/ComonModal'
// import InputView from './InputView'
export default class ChatViews extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled: false,

    })

    constructor(props) {
        super(props)
        this.state = {
            message: '',
            cell: true,
            tags: '',
            chat: true,
            json: ''
        }
        list = this.props.navigation.state.params.data;
        type = this.props.navigation.state.params.type;
        navigation = this.props.navigation
    }

    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    componentDidMount() {
        // if(Platform.OS==='android'){
        BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        // }
        postFetch(API.TotalHuifu, null, (result) => {
            this.setState({
                json: JSON.stringify(result).toString()
            })
        })
        Storage.get("userId").then((tagss) => {

            this.setState({
                tags: tagss
            })
        })
        this.subscription = DeviceEventEmitter.addListener('event', this.onResult)
        // MyMap.toMapActivity();
        // LoginModule.initChatView()

        // const list=this.props.navigation.state.params.data;
        // alert("hxId:"+list);
        // this._MapViews.initInputView()
    }

    onResult = (e) => {
        if (e.action === "LOADED") {
            // const list=this.props.navigation.state.params.data;
            // alert("hxId:"+list);
            // this._MapView.initChatView(list,1)
            if (this.state.cell) {
                this.setState({
                    cell: false
                })

                console.log("hxId:" + list);
                this._MapView.initChatView(list, type)
            }
        } else if (e.action === 'TO_USER_DETAIL') {
            if (this.state.tags === list) {
                this.props.navigation.navigate('MessageMain')
            } else {
                this.props.navigation.navigate('UserDetails', {hxid: list})
            }
        } else if (e.action === 'QUICK_REPLY') {
            if (this.state.chat) {
                this.setState({
                    chat: false
                })
                this._MapView.setQuickReply(this.state.json)
            }
        } else if (e.action === 'to_location_share_view') {
            this.props.navigation.navigate('LocationShareView')
        } else if (e.action === 'to_select_collection') {
            this.props.navigation.navigate('ShouCangDong', {
                data: '分享', callbacks: (data) => {
                    // alert(data)
                    this._MapView.sendShareMessage(data.id, data.content, data.img)
                },

            })
        }else if(e.action==='TO_STATE_DETAIL'){
         this.props.navigation.navigate('DongTaiDetails',{data:e.id})
        }
    }

    componentWillUnmount() {
        // DeviceEventEmitter.addListener('event',this.onResult).remove()
        //  DeviceEventEmitter.removeAllListeners()
        this.subscription.remove();
        // if(Platform.OS==='android'){
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        // }

    }

    render() {
        return (<View style={{flex: 1, backgroundColor: '#f9f9f9'}}>
            {type === 1 ?
                <ComonModal style={{position: 'absolute', zIndex: 1000,}}
                            navigation={navigation}/> :
                <ComonModal style={{position: 'absolute', zIndex: 1000,}} navigation={navigation}
                            selected={true} action={this.surebut.bind(this)}/>
            }
            <View style={styles.headerContainer}>
                {/*内容*/}
                <Text allowFontScaling={false} style={styles.middleTitle}>
                    消 息
                </Text>

                {/*左边返回按钮*/}
                <TouchableOpacity style={styles.leftImgBtn} onPress={() => {
                    this.props.navigation.goBack()
                }}>
                    <Image source={require("../../../img/page/arrow.png")}/>
                </TouchableOpacity>
                {/*<View style={styles.leftImgBtn}/>*/}

            </View>
            <ChatView
                ref={component => this._MapView = component}/>

            {/*<InputView style={{width:Contants.Screen.width,height:Contants.Screen.height}}*/}
            {/*ref={ component => this._MapViews = component }*/}
            {/*/>*/}

        </View>)
    }

    surebut() {
        this.props.navigation.navigate('QunManage', {data: list})
    }

    componentDidUpdate() {
        // const list=this.props.navigation.state.params.data;
        // alert("hxId:"+list)
        // this._MapView.initChatView(list,1)
        // const list=this.props.navigation.state.params.data;
        // console.log("hxId:"+list);
        // this._MapView.initChatView(list,1)
    }
}
const styles = StyleSheet.create({

    //导航栏样式
    headerContainer: {

        height: 60,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 0,
        width: "100%",
        marginTop: 0

    },

    leftImgBtn: {
        width: 105,
        height: 55,
        alignItems: "flex-end",
        justifyContent: "center",
        // marginLeft:Contents.Screen.width/3+30,
        // position:'absolute',
        alignSelf: 'flex-end',
        marginRight: Contents.Screen.width / 6 + 25.5,
        // backgroundColor:'red',
    },

    middleTitle: {

        fontSize: 18,
        marginLeft: 20,
        color: '#4D4D4D'
    },
    image: {
        position: 'absolute',

    }
})
