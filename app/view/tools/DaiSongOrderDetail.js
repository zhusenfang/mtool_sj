import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image
} from 'react-native';
import comstyle from '../../common/CommonStyle';
import {API,postFetch} from '../../common/GConst';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Contants from '../../common/Contants'
import TabBar from '../../common/DfyTabBar'
import DaiSongOrderFirst from './DaiSongOrderFirst'
import DaiSongOrderSec from './DaiSongOrderSec'
import CommonModal from '../CommonPage/ComonModal'
const tabTcon=[
    require('../../img/order/daohangunpress.png'),
    require('../../img/order/newsunpress.png'),

]
const tabTconsel=[
    require('../../img/order/daohangpress.png'),
    require('../../img/order/newspress.png'),

]
var navigation=null
export default class DaiSongOrderDetail extends Component {
    constructor(props){
        super(props)
        navigation=this.props.navigation
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    render(){
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

                <DaiSongOrderFirst navigation={navigation}/>
                <DaiSongOrderSec navigation={navigation}/>

            </ScrollableTabView>
            <TouchableOpacity style={{position:'absolute',marginTop:7,backgroundColor:'white',alignSelf:'flex-end'}}
                              onPress={this.touch.bind(this)}
            >
                <Image source={require('../../img/page/arrow.png')} style={{marginRight:Contants.Screen.width/6+25.5}}/>
            </TouchableOpacity>
        </View>)
    }
    touch(){
        this.props.navigation.goBack()
    }
}