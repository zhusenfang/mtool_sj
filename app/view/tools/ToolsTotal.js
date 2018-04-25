//通用导航头 （包含锄头导航）



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
    ListView
} from 'react-native';
import comstyle from '../../common/CommonStyle';
import {API,postFetch} from '../../common/GConst';
import Contants from '../../common/Contants';
import CheckBox from '../../common/CheckView';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../common/DfyTabBar'
import DaiSongOrder from './DaiSongOrder';
import MyOrder from './MyOrder';
import UserXuZhi from './UserXuZhi'
import CommonModal from '../CommonPage/ComonModal'
const tabTcon=[
    require('../../img/daisong/baounpress.png'),
    require('../../img/daisong/danunpress.png'),
    require('../../img/daisong/beizhuunpress.png')
]
const tabTconsel=[

    require('../../img/daisong/bao.png'),
    require('../../img/daisong/dan.png'),
    require('../../img/daisong/beizhu.png')
]
var navigation=null
export default class ToolsTotal extends Component{
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
        const page = this.props.navigation.state.params.data;
        return(

            <View style={{flex:1,flexDirection:'column',zIndex:100,backgroundColor:'#f9f9f9'}}>
                <CommonModal navigation={navigation}/>

                <ScrollableTabView
                    initialPage={page}
                    style={{marginTop:0,marginBottom:0,backgroundColor:'#f9f9f9'}}
                    tabBarPosition='top'
                    renderTabBar={() => <TabBar tabIconNames={tabTcon}
                                                selectedTabIconNames={tabTconsel}
                    />}

                    onChangeTab={
                        (obj) => {
                            // console.log('被选中的tab下标：' + obj.i);
                        }
                    }

                    onScroll={
                        (position) => {
                            // console.log('滑动时的位置：' + position);
                        }
                    }
                >

                    <DaiSongOrder navigation={navigation}/>
                    <MyOrder navigation={navigation}/>
                    <UserXuZhi navigation={navigation}/>
                </ScrollableTabView>

                <TouchableOpacity style={{position:'absolute',marginTop:7,backgroundColor:'white',alignSelf:'flex-end'}}
                                  onPress={this.touch.bind(this)}
                >
                    <Image source={require('../../img/page/arrow.png')} style={{marginRight:Contants.Screen.width/6+25.5}}/>
                </TouchableOpacity>

            </View>

        )
    }
    touch(){
        this.props.navigation.goBack()
    }
}