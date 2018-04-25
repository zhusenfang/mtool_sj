import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import SearchPage from '../../SearchPage'
import EndOrder from './EndOrder'
import EndOrderFirst from './EndOrderFirst'
import ProgressOrder from './ProgressOrder'
import OutOrder from './OutOrder'
import CommonModal from '../../CommonPage/ComonModal'
const tabTcon=[
    require('../../../img/order/orderunpress.png'),
    require('../../../img/order/ordersecunpres.png'),
    require('../../../img/order/orderthunpress.png')
]
const tabTconsel=[
    require('../../../img/order/orderpress.png'),
    require('../../../img/order/ordersecpress.png'),
    require('../../../img/order/orderthpress.png')
]
var navigation=null
export default class TotalOrder extends Component {
    constructor(props){
        super(props)
        navigation=this.props.navigation
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    render(){
        const page=this.props.navigation.state.params.data
        return(<View style={{flex:1,flexDirection:'column',zIndex:100,backgroundColor:'#f9f9f9'}}>
            <CommonModal navigation={navigation}/>
            <ScrollableTabView
                initialPage={page}
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

                <OutOrder navigation={navigation}/>
                <ProgressOrder navigation={navigation}/>
                <EndOrderFirst navigation={navigation}/>
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