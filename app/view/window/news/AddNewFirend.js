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
import CommonModal from '../../CommonPage/ComonModal'
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";

export default class AddNewFirend extends Component{
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
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
    render(){
        const list=this.props.navigation.state.params.data;
        return(<View style={[comstyle.con,{flexDirection:'column'}]}>
            <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={()=>{this.props.navigation.navigate('AddNewFriCard',{data:list})}}>
             <View style={comstyle.rightview}>
                 <Image source={require('../../../img/pinglun/guanzhu.png')} style={comstyle.maleft}/>
                 <Text style={comstyle.mesg}>关  注</Text>
             </View>
                <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
            </TouchableOpacity>
            <View style={comstyle.heng}/>
        </View>)
    }
}