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
    Button
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import SearchPage from '../../SearchPage'
import OrderPage from '../../OrderPage'
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import MyTimer from '../../../common/MyTimer'
// var TimerMixin=require('react-timer-mixin');
import Modal from 'react-native-modal'
import ProgressOrderDetail from './ProgressOrderDetail';
import ProgressNews from './ProgressNews'
// var comdtime=600;
var navigation=null
import CommonModal from '../../CommonPage/ComonModal'
const tabTcon=[
    require('../../../img/order/daohangunpress.png'),
    require('../../../img/order/newsunpress.png'),

]
const tabTconsel=[
    require('../../../img/order/daohangpress.png'),
    require('../../../img/order/newspress.png'),

]
export default class DaoOrderDetail extends Component {

    constructor(props){
        super(props)
        this.state={

        }
        navigation=this.props.navigation
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    render(){
        const list=this.props.navigation.state.params.data;
        // alert(JSON.stringify(list))
        return(<View style={{flex:1,flexDirection:'column',zIndex:100,backgroundColor:'#f9f9f9'}}>
            <CommonModal navigation={navigation}/>
            <ScrollableTabView
                style={{marginTop:0,marginBottom:0}}
                tabBarPosition='top'
                renderTabBar={() => <TabBar tabIconNames={tabTcon}
                                            selectedTabIconNames={tabTconsel}
                />}

                onChangeTab={
                    (obj) => {
                        console.log('被选中的tab下标：' + obj.i);
                    }
                }

                onScroll={
                    (position) => {
                        console.log('滑动时的位置：' + position);
                    }
                }
            >

                <ProgressOrderDetail navigation={navigation}/>
                <ProgressNews navigation={navigation}/>

            </ScrollableTabView>
            <TouchableOpacity style={{position:'absolute',marginTop:7,backgroundColor:'white',alignSelf:'flex-end'}}
                              onPress={this.touch.bind(this)}
            >
                <Image source={require('../../../img/page/arrow.png')} style={{marginRight:Contants.Screen.width/6+25.5}}/>
            </TouchableOpacity>
        </View>)
    }
    touch(){
        this.props.navigation.goBack()
    }
}