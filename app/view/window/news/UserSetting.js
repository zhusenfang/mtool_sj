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
import Toast from "react-native-easy-toast";
export default class UserSetting extends Component{
    constructor(props){
        super(props)
        this.state={
            falseSwitchIsOn:false,
            falsetalokme:false,
            falseloolta:false,
            falseping:false
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
    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        const list=this.props.navigation.state.params.data;
        postFetch(API.YinSi,{friend2Id:list},(result)=>{
            // alert(JSON.stringify(result))
            if(result.data==undefined){
                this._toastf.show('您未关注好友')
                return
            }else {
            if(result.status==1){
                if(result.data.speak==0){
                    this.setState({
                        falseSwitchIsOn:false
                    })
                }else {
                    this.setState({
                        falseSwitchIsOn:true
                    })
                }
                if(result.data.friend2Switch==0){
                    this.setState({
                        falsetalokme:false
                    })
                }else {
                    this.setState({
                        falsetalokme:true
                    })
                }
                if(result.data.friend1Switch==0){
                    this.setState({
                        falseloolta:false
                    })
                }else {
                    this.setState({
                        falseloolta:true
                    })
                }
             if(result.data.shield==0){
                    this.setState({
                        falseping:false
                    })
             }else {
                 this.setState({
                     falseping:true
                 })
             }

            }
            }
        },(error)=>{
            alert(error)
        })
    }
    render(){
        const list=this.props.navigation.state.params.data;
        return(<View style={[comstyle.con,{flexDirection:'column'}]}>
            <View style={[comstyle.item,{marginTop:20}]}>
                <Text style={styles.jinzhi}>禁止向我发言</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({falseSwitchIsOn:value})
                        if(this.state.falseSwitchIsOn==false){
                            postFetch(API.YinSiSetting,{speak:1,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiSetting,{speak:0,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.falseSwitchIsOn}
                     onTintColor='#FF305E'
                    // // tintColor='blue'
                     thumbTintColor='white'
                    style={comstyle.textright}

                />
            </View>
            <View style={comstyle.heng}/>

            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>不让TA看我的动态</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({falsetalokme:value})
                        if(this.state.falsetalokme==false){
                            postFetch(API.YinSiSetting,{friend2Switch:1,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiSetting,{friend2Switch:0,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.falsetalokme}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}
                />
            </View>

            <View style={comstyle.heng}/>

            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>不看TA的动态</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({falseloolta:value})
                        if(this.state.falseloolta==false){
                            postFetch(API.YinSiSetting,{friend1Switch:1,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiSetting,{friend1Switch:0,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.falseloolta}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}
                />
            </View>

            <View style={comstyle.heng}/>

            <View style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.jinzhi}>屏蔽该用户</Text>
                <Switch
                    onValueChange={(value)=>
                    {this.setState({falseping:value})
                        if(this.state.falseping==false){
                            postFetch(API.YinSiSetting,{shield:1,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('开启成功')
                                }
                            })
                        }else {
                            postFetch(API.YinSiSetting,{shield:0,friend2Id:list},(result)=>{
                                // alert(JSON.stringify(result))
                                if(result.status==1){
                                    this._toastf.show('关闭成功')
                                }
                            })
                        }
                    }}
                    value={this.state.falseping}
                    onTintColor='#FF305E'
                    // // tintColor='blue'
                    thumbTintColor='white'
                    style={comstyle.textright}
                />
            </View>
            <View style={comstyle.heng}/>

            <TouchableOpacity style={[comstyle.item,{marginTop:6}]}>
                <Text style={styles.qing}>清空聊天记录</Text>
            </TouchableOpacity>
            <Toast ref={(e) => {
                this._toastf = e
            }}
                   position='center'
            />
        </View>)
    }
}
const styles=StyleSheet.create({
jinzhi:{
    fontSize:14,
    color:'#282828',
    marginLeft:20
},
    qing:{
    fontSize:14,
        color:'#B2B2B2',
        marginLeft:20
    }


})