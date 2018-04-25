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
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Contants from '../../../common/Contants'
import TabBar from '../../../common/DfyTabBar'
import UserDetailFirst from './UserDetailFirst'
import UserDetailSec from './UserDetailSec'
import CommonModal from '../../CommonPage/ComonModal'
const tabTcon=[
    require('../../../img/shezhi/dongtaifirunpress.png'),
    require('../../../img/shezhi/dongtaisecunpress.png'),

]
const tabTconsel=[
    require('../../../img/shezhi/dongtaifipress.png'),
    require('../../../img/shezhi/dongtaisecpress.png'),

]
var navigation=null
export default class UserDetails extends Component {
    constructor(props){
        super(props)
        navigation=this.props.navigation
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    render(){
        // const page=this.props.navigation.state.params.id;
        return(<View style={{flex:1,flexDirection:'column',zIndex:100,backgroundColor:'#f9f9f9'}}>
            <CommonModal navigation={navigation}/>
            <ScrollableTabView
                initialPage={0}
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

                <UserDetailFirst navigation={navigation}/>
                <UserDetailSec navigation={navigation}/>

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