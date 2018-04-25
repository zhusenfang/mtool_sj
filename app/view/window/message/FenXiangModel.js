import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    Image,
    TouchableOpacity,
    ListView,
    Platform,
    BackHandler,
    ScrollView
} from 'react-native';
import comstyle from '../../../common/CommonStyle'
import {API,postFetch} from '../../../common/GConst';
import Toast from "react-native-easy-toast";
import Contants from '../../../common/Contants'
import ExpandableList from 'react-native-expandable-section-flatlist';
import MyCheckView from '../../../common/MyCheckView'
import Modal from 'react-native-modal';
import CheckBox from '../../../common/CheckView'
export default class FenXiangModel extends Component{

    render(){
        return(<View>
            <View style={{
                flexDirection: "column",
                // marginTop: Contants.Screen.height/2,
                backgroundColor: "white",
                width: Contants.Screen.width,
                height: 274,
                // justifyContent: "space-between",
                // paddingLeft: 10,
                // paddingRight: 10,
            }}>
                <View style={{flexDirection:'row',height:100,marginBottom:20}}>
                    <ScrollView
                        // style={{flexDirection:'row',height:40}}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        automaticallyAdjustContentInsets={true}
                        contentContainerStyle={{flexDirection:'column'}}
                    >
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={styles.scrollist} onPress={this.props.fenxiang()}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/dongtai.png')}/>
                                </View>
                                <Text>分享到动态</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.scrollist} onPress={this.props.pengyouquan()}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/weixinf.png')}/>
                                </View>
                                <Text>微信朋友圈</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.scrollist} onPress={this.props.sharefriend()}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/wfriend.png')}/>
                                </View>
                                <Text>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.scrollist} onPress={this.props.qqkongjian()}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/qqkongj.png')}/>
                                </View>
                                <Text>QQ空间</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.scrollist} onPress={this.props.qqfriend()}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/qqfriend.png')}/>
                                </View>
                                <Text>QQ好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.scrollist} onPress={this.props.xinlang()}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/xinlang.png')}/>
                                </View>
                                <Text>新浪微博</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            </View>
        </View>)
    }
}
const styles=StyleSheet.create({
    border:{
        height:57,width:57,borderWidth:1,borderRadius:6,borderColor:'#E5E5E5',
        justifyContent:'center',alignItems:'center',
    },
    scrollist:{
        flexDirection:'column',alignItems:'center',marginTop:20,marginLeft:10,marginRight:10,marginBottom:20
    },
})