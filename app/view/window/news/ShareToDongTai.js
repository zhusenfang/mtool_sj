import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    FlatList,
    ListView,
    RefreshControl,
    ActivityIndicator,
    ScrollView,
    DeviceEventEmitter,
    BackHandler,
    Platform,
    ToastAndroid,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants';
import Modal from 'react-native-modal';
import MyCheckView from '../../../common/MyCheckView'
import *as wechat from 'react-native-wechat'
import Storage from '../../../common/GGAsyncStorage'
import Toast from "react-native-easy-toast";
import RadioModal from 'react-native-radio-master';
import WatchVideo from '../../nativeModuals/WatchVideo'
import ImageResizer from 'react-native-image-resizer';
import UShare from '../../../view/share/share';
import SharePlatform from '../../../view/share/SharePlatform'
export default class ShareToDongTai extends Component{
    constructor(props){
        super(props)
        this.state={
            textinput:'',
        }
    }
    render(){
        return(<View style={comstyle.con}>
            <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                <View style={styles.con}>
                    <View style={styles.input}>
                        <TextInput
                            style={{
                                backgroundColor: "#FFFFFF",
                                // textAlign: "center",
                                height: 70,
                                borderWidth: 1,
                                borderColor: '#E5E5E5',
                                width: Contants.Screen.width - 40,
                                // marginLeft:10,
                                borderRadius: 4,

                                margin: 10,
                            }}
                            placeholder={'发表新动态...'}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e) => {
                                this.setState({
                                    textinput: e,
                                })
                            }}/>
                    </View>
                </View>
                <View style={{flex: 1}}/>
                <View style={[styles.tups]}>
                    <View style={styles.item}>
                        {/*<Image source={require('../../../img/pinglun/ait.png')}*/}
                               {/*style={styles.imgm}/>*/}
                        <Image source={require('../../../img/pinglun/errpress.png')}
                               style={styles.imgm}/>
                        {/*<Image source={require('../../../img/pinglun/shoucang.png')}*/}
                               {/*style={styles.imgm}/>*/}
                    </View>
                    <TouchableOpacity onPress={this.fasong.bind(this)}>
                        <Image source={require('../../../img/pinglun/fasong.png')}
                               style={styles.time}>
                            <Text style={styles.song}>发送</Text>
                        </Image>
                    </TouchableOpacity>
                </View>
                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
            </KeyboardAvoidingView>
        </View>)
    }
    fasong(){
        if(this.state.textinput===''){
            return
        }
        this.props.navigation.state.params.callbacks()
        const list=this.props.navigation.state.params.data;
      postFetch(API.FenXiangDaoDong,{id:list,share:this.state.textinput},(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
              // this.props.navigation.navigate('NewsMain',{data:1})
              this.props.navigation.state.params.callbacks('回调')

              this.props.navigation.goBack();
          }
      },(error)=>{
          alert(JSON.stringify(error))
      })
    }
}
const styles = StyleSheet.create({
    con: {
        height: 186,
        backgroundColor: 'white',
        flexDirection: 'column',
        // alignItems:'center',
        marginTop: 20
    },
    input: {
        alignItems: 'center', justifyContent: 'center'
    },
    tup: {
        flexDirection: 'row',
    },
    imge: {
        marginLeft: 20,
        marginTop: 0,
        marginBottom: 10,
        marginRight: 10
    },
    tups: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    imgm: {
        margin: 10
    },
    song: {
        fontSize: 12,
        color: 'white',
    },
    time: {
        marginRight: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',

    },
})