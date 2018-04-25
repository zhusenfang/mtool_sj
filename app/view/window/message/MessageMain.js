import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Setting from '../setting/MainSetting';
import MainMessage from './MineMessage'
import TabBar from '../../../common/DfyTabBar'
import Contants from '../../../common/Contants'
import CommonModal from '../../CommonPage/ComonModal'
const tabTcon=[
    require('../../../img/shezhi/homeunp.png'),
    require('../../../img/shezhi/shezhi.png'),

]
const tabTconsel=[
    require('../../../img/shezhi/home.png'),
    require('../../../img/shezhi/shezhipress.png'),

]
var navigation=null
export default class MessageMain extends Component{
    constructor(props){
    super(props);
        navigation=this.props.navigation
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    render(){
        return(<View style={{flex:1,flexDirection:'column',zIndex:100,}}>
            <CommonModal navigation={navigation}/>
            <ScrollableTabView
                style={{marginTop:0,marginBottom:0}}
                tabBarPosition='top'
                renderTabBar={() => <TabBar tabIconNames={tabTcon}
                                            selectedTabIconNames={tabTconsel}
                                    />
                }

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

                <MainMessage navigation={navigation}/>
                <Setting navigation={navigation}/>

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