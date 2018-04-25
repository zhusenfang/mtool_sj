
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    DeviceEventEmitter
} from 'react-native';
import Contants from '../../common/Contants'
import Modal from 'react-native-modal';
import {NavigationActions} from 'react-navigation'
export default class ComonModal extends Component{
    constructor(props){
        super(props)
        this.state={
            isshowmodal:false,
            isShowClas:false,
        }
    }
    render(){
        if(Platform.OS=='ios'){
            return(


                <View style={{zIndex:100}}>
                {this.renderHeader()}
                <Modal
                    isVisible={this.state.isshowmodal}
                    hideOnBack={true}
                    transparent={true}
                    style={styles.modalstyle}
                    //backdropColor='transferent'
                    backdropOpacity={0.3}
                    animationIn={'slideInRight'}
                    animationOut={'slideOutRight'}
                >

                    <Image source={require("../../img/page/background.png")} style={{marginLeft:Contants.Screen.width/3-20}}>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <TouchableOpacity style={styles.gonggao} onPress={this.publicord.bind(this)}>
                                <Image source={require("../../img/order/shanghuto.png")} />
                                <Text>商户通</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sousuo} onPress={this.searchview.bind(this)}>
                                <Image source={require("../../img/order/shousuo.png")} />
                                <Text>搜 索</Text>
                            </TouchableOpacity>
                            {/*中心红色按钮*/}
                            <TouchableOpacity style={styles.btncons} onPress={()=>{
                                this.setState({
                                    isshowmodal:false
                                })
                            }}>

                                <Image source={require("../../img/page/buttonselt.png")} style={styles.btnimgs} />
                            </TouchableOpacity>
                        </View>

                        {/*下面的订单等*/}
                        <View style={{flexDirection:'column',justifyContent:"flex-end",alignSelf:'flex-end',marginRight:15}}>
                            <TouchableOpacity style={styles.dingdan} onPress={this.dingdan.bind(this)}>
                                <Image source={require("../../img/order/dingdan.png")} />
                                <Text>订 单</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.xiaoxi} onPress={this.news.bind(this)}>
                                <Image source={require("../../img/order/message.png")} />
                                <Text>消 息</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.xiaoxi} onPress={this.gongju.bind(this)}>
                                <Image source={require("../../img/order/tools.png")} />
                                <Text>工 具</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.xiaoxi} onPress={this.settingview.bind(this)}>
                                <Image source={require("../../img/order/mine.png")}/>
                                <Text>我 的</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.xiaoxi} onPress={this.hexiao.bind(this)}>
                                <Image source={require("../../img/order/hexiao.png")}/>
                                <Text>核 销</Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
                <Modal
                    isVisible={this.state.isShowClas}
                    hideOnBack={true}
                    transparent={true}
                    style={styles.modalstyle}
                    //backdropColor='transferent'
                    backdropOpacity={0.5}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isShowClas: false});

                        }}
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                    />

                    <TouchableOpacity style={styles.close} onPress={()=>{this.setState({isShowClas:false})}}>
                        <Image source={require('../../img/search/close.png')} style={styles.closeimg}/>
                    </TouchableOpacity>
                    <View style={styles.fenlei}>
                        <Text style={styles.fenelicol}>请选择您希望搜索的分类</Text>
                    </View>
                    <View style={styles.totcon}>
                        <Text style={styles.shejiao}>社  交</Text>

                        <View style={styles.hengs}/>
                    </View>
                    <View style={styles.gouw}>
                        <Image source={require('../../img/search/classify.png')} style={styles.news}>
                            <Text style={styles.totle}>消息/联系人</Text>
                        </Image>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowClas:false
                            })
                            this.props.navigation.navigate('SearchDongTai')
                        }}>
                            <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                <Text style={styles.totle}>动 态</Text>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.totcon}>
                        <Text style={styles.shejiao}>我  的</Text>
                        <View style={styles.hengs}/>
                    </View>
                    <View style={styles.gouw}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowClas:false
                            })
                            this.props.navigation.navigate('SearchShouCang')}}>
                            <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                <Text style={styles.totle}>收 藏</Text>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowClas:false
                            })
                            this.props.navigation.navigate('SearchGreated')
                        }}>
                            <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                <Text style={styles.totle}>赞 过</Text>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowClas:false
                            })
                            this.props.navigation.navigate("SearchOrder")
                        }}>
                            <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                <Text style={styles.totle}>订 单</Text>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
            )
        }else {
            // var rightImg=null;
            // if(this.props.selected===true){
            //     rightImg=(<View>
            //
            //     </View>)
            // }

            return(
                <View >
                    {this.renderHeader()}
                    <Modal
                        isVisible={this.state.isshowmodal}
                        hideOnBack={true}
                        transparent={true}
                        style={styles.modalstyle}
                        //backdropColor='transferent'
                        backdropOpacity={0.3}
                        animationIn={'slideInRight'}
                        animationOut={'slideOutRight'}
                    >
                        {/*点击外框，键盘消失*/}
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isshowmodal: false});

                            }}
                            style={{position: "absolute", top: 80, left: 0, right: 80, bottom: 0,zIndex:100}}
                        />
                        <View style={{alignSelf:'flex-end'}}>

                        <Image source={require("../../img/page/background.png")} style={{marginRight:2}}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <TouchableOpacity style={styles.gonggao} onPress={this.publicord.bind(this)}>
                                    <Image source={require("../../img/order/shanghuto.png")} />
                                    <Text style={styles.comtext}>商户通</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.sousuo} onPress={this.searchview.bind(this)}>
                                    <Image source={require("../../img/order/shousuo.png")} />
                                    <Text style={styles.comtext}>搜 索</Text>
                                </TouchableOpacity>
                                {/*中心红色按钮*/}
                                <TouchableOpacity style={styles.btncons} onPress={()=>{
                                    this.setState({
                                        isshowmodal:false
                                    })
                                }}>

                                    <Image source={require("../../img/page/buttonselt.png")} style={styles.btnimgs} />
                                </TouchableOpacity>
                            </View>

                            {this.props.selected===true? <Image source={require('../../img/pinglun/xiaokuang.png')}
                                                                style={{marginRight:Contants.Screen.width/3,position:'absolute',alignItems:'center',justifyContent:'center',marginTop:Contants.Screen.height/8,
                                                                zIndex:1000}}

                            >
                                <TouchableOpacity style={{alignItems:'center',flexDirection:'row'}} onPress={this.xiangqing.bind(this)}>
                                    <Image source={require('../../img/window/write.png')}/>
                                    <Text style={{marginLeft:20}}>详细信息</Text>
                                </TouchableOpacity>
                            </Image>:null}

                            {/*下面的订单等*/}
                            <View style={{flexDirection:'column',justifyContent:"flex-end",alignSelf:'flex-end',marginRight:15}}>
                                <TouchableOpacity style={styles.dingdan} onPress={this.dingdan.bind(this)}>
                                    <Image source={require("../../img/order/dingdan.png")} />
                                    <Text style={styles.comtext}>订 单</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.xiaoxi} onPress={this.news.bind(this)}>
                                    <Image source={require("../../img/order/message.png")} />
                                    <Text style={styles.comtext}>消 息</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.xiaoxi} onPress={this.gongju.bind(this)}>
                                    <Image source={require("../../img/order/tools.png")} />
                                    <Text style={styles.comtext}>工 具</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.xiaoxi} onPress={this.settingview.bind(this)}>
                                    <Image source={require("../../img/order/mine.png")}/>
                                    <Text style={styles.comtext}>我 的</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.xiaoxi} onPress={this.hexiao.bind(this)}>
                                    <Image source={require("../../img/order/hexiao.png")}/>
                                    <Text style={styles.comtext}>核 销</Text>
                                </TouchableOpacity>
                            </View>
                        </Image>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.isShowClas}
                        hideOnBack={true}
                        transparent={true}
                        style={styles.modalstylesea}
                        //backdropColor='transferent'
                        backdropOpacity={0.5}
                    >
                        {/*点击外框，键盘消失*/}
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({isShowClas: false});

                            }}
                            style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                        />

                        <TouchableOpacity style={styles.close} onPress={()=>{this.setState({isShowClas:false})}}>
                            <Image source={require('../../img/search/close.png')} style={styles.closeimg}/>
                        </TouchableOpacity>
                        <View style={styles.fenlei}>
                            <Text style={styles.fenelicol}>请选择您希望搜索的分类</Text>
                        </View>
                        <View style={styles.totcon}>
                            <Text style={styles.shejiao}>社  交</Text>

                            <View style={styles.hengs}/>
                        </View>
                        <View style={styles.gouw}>
                            <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                <Text style={styles.totle}>消息/联系人</Text>
                            </Image>
                            <TouchableOpacity onPress={()=>{
                                this.setState({
                                    isShowClas:false
                                })
                                this.props.navigation.navigate('SearchDongTai')
                            }}>
                                <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                    <Text style={styles.totle}>动 态</Text>
                                </Image>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.totcon}>
                            <Text style={styles.shejiao}>我  的</Text>
                            <View style={styles.hengs}/>
                        </View>
                        <View style={styles.gouw}>
                            <TouchableOpacity onPress={()=>{
                                this.setState({
                                    isShowClas:false
                                })
                                this.props.navigation.navigate('SearchShouCang')}}>
                                <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                    <Text style={styles.totle}>收 藏</Text>
                                </Image>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                this.setState({
                                    isShowClas:false
                                })
                                this.props.navigation.navigate('SearchGreated')
                            }}>
                                <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                    <Text style={styles.totle}>赞 过</Text>
                                </Image>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                this.setState({
                                    isShowClas:false
                                })
                                this.props.navigation.navigate("SearchOrder")
                            }}>
                                <Image source={require('../../img/search/classify.png')} style={styles.news}>
                                    <Text style={styles.totle}>订 单</Text>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            )
        }
    }
    renderHeader(){
        return(

            <View style={styles.headercontainer}>
                <TouchableOpacity style={styles.btncon} onPress={()=>{
                    this.setState({
                        isshowmodal:true
                    })
                }}>

                    <Image source={require("../../img/page/button.png")} style={styles.btnimg}/>
                </TouchableOpacity>
            </View>

        )
    }
    xiangqing(){
        // alert('gai')
        //  DeviceEventEmitter.emit('messtouch','改变')
        // this.setState
        // this.props.navigation.navigate('QunManage')
        this.props.action()
        this.setState({
            isshowmodal:false
        })
    }
    publicord(){
        // this.props.navigation.navigate("Login")
        this.setState({
            isshowmodal:false
        })
        // this.state.props.navigation.navigate('Login')
    }
    searchview(){
        // this.props.navigation.navigate("SearchView")
        this.setState({
            isshowmodal:false,
            isShowClas:true
        })
    }
    dingdan(){
        this.props.navigation.navigate('Index')
        this.setState({
            isshowmodal:false
        })
    }
    settingview(){
        this.props.navigation.navigate('MessageMain')
        this.setState({
            isshowmodal:false
        })
    }
    news(){
        this.props.navigation.navigate('NewsMain',{data:0})
        this.setState({
            isshowmodal:false
        })
    }
    hexiao(){
        this.props.navigation.navigate('HeXiaoView')
        this.setState({
            isshowmodal:false
        })
    }
    gongju(){
        this.props.navigation.navigate('ToolsService',{data:0})
        this.setState({
            isshowmodal:false
        })
        // const resetAction=NavigationActions.reset({
        //     index:1,
        //     actions:[NavigationActions.navigate({routeName:'Index'}),
        //         NavigationActions.navigate({routeName:'ToolsService'})
        //     ]
        // })
        // this.props.navigation.dispatch(resetAction)
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    img:{
        width:20,
        height:20,
        backgroundColor:"white"
    },
    btnimg:{
        width:60,
        height:60,
      marginRight:20,

    },
    btncon:{
        marginTop:0,
        alignItems:"center",
        justifyContent:"center",
        marginBottom:30,
        zIndex:10
    },
    headercontainer:{
        zIndex:1000,
        marginBottom:40,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+100,
        marginTop:10,
        alignSelf:'flex-end',
    },
    modalstyle:{
        backgroundColor:"transparent",
        margin:0,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        marginTop:10,
        alignSelf:'flex-end',
    },
    modalstylesea:{
        backgroundColor:"transparent",
        margin:0,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        marginTop:25,
        alignSelf:'center',
    },
    btncons:{
        marginTop:5,
        alignItems:"center",
        justifyContent:"center",
        // marginBottom:30,
        // marginLeft:Contants.Screen.width/3+29
        marginLeft:20
    },


    gonggao:{
        flexDirection:'column',
        // position:'absolute',
        marginLeft:30,
        // marginTop:10,
        alignItems:'center',
        justifyContent:'center'
    },

    sousuo:{
        flexDirection:'column',
        // position:'absolute',
        // marginTop:10,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:40,
    },
    dingdan:{
        flexDirection:'column',

        alignItems:'center',
        justifyContent:'center',
        // marginLeft:Contants.Screen.width/3+50
        marginTop:30
    },
    xiaoxi:{
        flexDirection:'column',

        alignItems:'center',
        justifyContent:'center',
        // marginLeft:Contants.Screen.width/3+50,
        marginTop:30
    },
    closeimg:{
        alignSelf:'flex-end',
        marginLeft:302
    },
    fenlei:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    fenelicol:{
        color:'#F9F9F9',
        fontSize:18,
        lineHeight:24
    },
    shejiao:{
        alignSelf:'center',
        fontSize:14,
        color:'#B2B2B2',
        marginTop:24
    },
    hengs:{
        alignSelf:'center',
        width:335,
        height:1,
        backgroundColor:'#B2B2B2',
        flexDirection:'row',
        marginTop:20,
        marginBottom:20,
        marginLeft:15
    },
    gouw:{
        flexDirection:'row',

    },
    news:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginLeft:15
    },
    totle:{
        fontSize:14,
        color:'#4D4D4D'
    },
    totcon:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    comtext:{
        fontSize:12,
        color:'#282828'
    },
    btnimgs:{
        width:60,
        height:60,
        marginTop:3,
        marginLeft:13
    },


});