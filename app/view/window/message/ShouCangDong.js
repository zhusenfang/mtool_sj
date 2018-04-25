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
    ToastAndroid,
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
import ComonModal from '../../CommonPage/ComonModal'
var navigation=null
var mSelectWhat = -1;
var flatlist=''
import WatchVideo from '../../nativeModuals/WatchVideo'
import FenXiangModel from './FenXiangModel'
import *as wechat from 'react-native-wechat'
import UShare from '../../../view/share/share';
import SharePlatform from '../../../view/share/SharePlatform'
var list=''
var bigimage=[]
export default class ShouCangDong extends Component{
    constructor(props){
        super(props)
        this.state={
         mockData:[],
            isselect:false,
            isShowModal:false,
            isSetting:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            list:[],
            selectId:'',
            postId:'',
            isModals:false,
            isBianjiName:false,
            dataSources: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            listAllid:'',
            xuanze:'',
            data:'',
            dataSourceimg: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            dataArray:[],
            isShowFenXiang:false
        }
        navigation=this.props.navigation
        list=this.props.navigation.state.params.data;
    }
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled:false,

    })
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }

    componentDidMount(){
        wechat.registerApp('wx1ccb336f561e993d')
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        this.postFetchs();
    }
    postFetchs(){
        postFetch(API.ShouCangDongApi,{memberCollectCatalog:{type:2}},(result)=>{
            // alert(JSON.stringify(result.data.resourceIsNull))
            if(result.status==1){
                this.setState({
                    mockData:result.data
                })
            }
        },(error)=>{

        })
    }
    componentWillMount(){
        postFetch(API.SearchShouCang,{memberCollectCatalog:{type:2}},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data),
                    dataArray:result.data
                })
                var LetAll=result.data;
                result.data.map((o,i)=>{
                    if(!this.props.mID){
                        LetAll[i]['isCheck']=false
                    }else {
                        if(this.props.mID==o.user_id){
                            LetAll[i]['isCheck']=true
                        }else {
                            LetAll[i]['isCheck']=false
                        }
                    }
                })
                this.LetAll=LetAll
                this.setState({
                    dataSources:this.state.dataSources.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
                })
            }
        })
    }
    addClassify(){
        if(this.state.data==''){
            this.props.navigation.navigate('BianJiName',{data:'',callbackimg:(data)=>{this.postFetchs()},callback:(data)=>{this.setState({data:data})}})
        }else {
            if(this.state.listAllid==''){


                postFetch(API.BianjiMingCheng,{memberCollectCatalog:{name:this.state.data,type:2}},(result)=>{
                    // alert(JSON.stringify(result))
                    if(result.status==1){
                        this._toastdj.show('分类添加成功')
                        this.postFetchs()
                    }
                },(error)=>{
                    this._toastdj.show(error)
                })
            }else {
                postFetch(API.BianjiShouCang,{memberCollectCatalog:{name:this.state.data,id:this.state.listAllid}},(result)=>{
                    // alert(JSON.stringify(result))
                    if(result.status==1){
                        // setTimeout(function () {
                        this._toastdj.show('编辑成功')
                        // },1000)

                        // this.props.navigation.goBack();
                        this.postFetchs()
                    }
                },(error)=>{
                    this._toastdj.show(error)
                })
            }
        }
    }
    render(){
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9',zIndex:100,flexDirection:'column'}]}>

                {/*<ComonModal  navigation={navigation} />*/}
            {this.renderHeader()}
            <Modal
                isVisible={this.state.isModals}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyles}
                //backdropColor='transferent'
                backdropOpacity={0.3}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isModals: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />

                <Image source={require("../../../img/page/background.png")} style={{marginRight:2}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <TouchableOpacity style={styles.gonggao} onPress={this.publicord.bind(this)}>
                            <Image source={require("../../../img/order/shanghuto.png")} />
                            <Text>商户通</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sousuo} onPress={this.searchview.bind(this)}>
                            <Image source={require("../../../img/order/shousuo.png")} />
                            <Text>搜 索</Text>
                        </TouchableOpacity>
                        {/*中心红色按钮*/}
                        <TouchableOpacity style={styles.btncons} onPress={()=>{
                            this.setState({
                                isModals:false
                            })
                        }}>

                            <Image source={require("../../../img/page/buttonselt.png")}  />
                        </TouchableOpacity>
                    </View>
                    {/*下面的订单等*/}

                    <Image source={require('../../../img/pinglun/xiaokuang.png')} style={{marginRight:Contants.Screen.width/3,position:'absolute',alignItems:'center',justifyContent:'center',marginTop:Contants.Screen.height/8}}

                    >
                        <TouchableOpacity style={{alignItems:'center',flexDirection:'row'}} onPress={this.bianji.bind(this)}>
                            <Image source={require('../../../img/window/write.png')}/>
                            <Text style={{marginLeft:20}}>编辑名称</Text>
                        </TouchableOpacity>
                    </Image>

                    <Image source={require('../../../img/pinglun/xiaokuang.png')} style={{marginRight:Contants.Screen.width/3,position:'absolute',alignItems:'center',justifyContent:'center',marginTop:Contants.Screen.height/5+20}}>
                        <TouchableOpacity style={{alignItems:'center',flexDirection:'row'}} onPress={this.delectclassify.bind(this)}>
                            <Image source={require('../../../img/window/lajitong.png')}/>
                            <Text style={{marginLeft:20}}>删除分类</Text>
                        </TouchableOpacity>
                    </Image>

                    {/*下面的订单等*/}
                    <View style={{flexDirection:'column',justifyContent:"flex-end",alignSelf:'flex-end',marginRight:15}}>
                        <TouchableOpacity style={styles.dingdan} onPress={this.dingdan.bind(this)}>
                            <Image source={require("../../../img/order/dingdan.png")} />
                            <Text>订 单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.xiaoxi} onPress={this.news.bind(this)}>
                            <Image source={require("../../../img/order/message.png")} />
                            <Text>消 息</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.xiaoxi} onPress={this.gongju.bind(this)}>
                            <Image source={require("../../../img/order/tools.png")} />
                            <Text>工 具</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.xiaoxi} onPress={this.settingview.bind(this)}>
                            <Image source={require("../../../img/order/mine.png")}/>
                            <Text>我 的</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.xiaoxi} onPress={this.hexiao.bind(this)}>
                            <Image source={require("../../../img/order/hexiao.png")}/>
                            <Text>核 销</Text>
                        </TouchableOpacity>
                    </View>
                </Image>
            </Modal>


            <Image source={require("../../../img/page/navibar.png")} style={styles.headerContainer}>
                {/*内容*/}
                <Text allowFontScaling={false} style={styles.middleTitle}>
                    收藏的动态
                </Text>

                {/*左边返回按钮*/}
                <TouchableOpacity style={styles.leftImgBtn} onPress={() => {

                   this.props.navigation.goBack();

                }}>
                    <Image source={require("../../../img/page/arrow.png")}/>
                </TouchableOpacity>


                {/*<View style={styles.leftImgBtn}/>*/}

            </Image>
            <TouchableOpacity style={[comstyle.item,{marginTop:20}]} onPress={this.addClassify.bind(this)}>
            <View style={comstyle.rightview}>
            <Image source={require('../../../img/window/tianjiafen.png')} style={comstyle.maleft}/>
            <Text style={[comstyle.mesg,{color:'#282828',fontSize:14}]}>{this.state.data==''?'添加分类':this.state.data}</Text>
            </View>
                <TouchableOpacity onPress={this.addClassify.bind(this)}>
            <Image source={this.state.data==''?require('../../../img/window/write.png'):require('../../../img/window/press.png')} style={[{marginRight:20}]}/>
                </TouchableOpacity>
            </TouchableOpacity>
            <ExpandableList
                dataSource={this.state.mockData}
                headerKey="name"
                memberKey="forumPostDos"
                renderRow={this._renderRow.bind(this)}
                renderSectionHeaderX={this._renderSection.bind(this)}
                // openOptions={[1,]}
                style={{marginTop:20}}

            />
            <Modal
                isVisible={this.state.isShowModal}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowModal: false});

                    }}
                    style={styles.jian}
                />

                <View style={{height:137,width:255,flexDirection:'column',backgroundColor:'white',borderRadius:5,alignSelf:'center'}}>
                    <TouchableOpacity style={styles.itemlist} onPress={this.selefenxi.bind(this)}>
                        <Image source={require('../../../img/pinglun/fenxiangfir.png')} style={comstyle.maleft}/>
                        <Text style={comstyle.mesg}>分  享</Text>
                    </TouchableOpacity>
                    <Image source={require('../../../img/window/xuxian.png')}/>
                    <TouchableOpacity style={styles.itemlist} onPress={this.quitshoucang.bind(this)}>
                        <Image source={require('../../../img/pinglun/guanzhupress.png')} style={comstyle.maleft}/>
                        <Text style={comstyle.mesg}>取消收藏</Text>
                    </TouchableOpacity>
                    <Image source={require('../../../img/window/xuxian.png')}/>
                    <TouchableOpacity style={styles.itemlist} onPress={()=>{this.setState({
                        isSetting:true,
                        isShowModal:false
                    })}}>
                        <Image source={require('../../../img/window/tianjiafen.png')} style={comstyle.maleft}/>
                        <Text style={comstyle.mesg}>设置分类</Text>
                    </TouchableOpacity>
                </View>
                <Toast ref={(e) => {
                    this._toasts = e
                }}
                       position='center'
                />
            </Modal>

            <Modal
                isVisible={this.state.isSetting}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isSetting: false});

                    }}
                    style={styles.jian}
                />
                <View style={{height:300,width:340,borderRadius:5,alignSelf:'center',}}>
                <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderchang.bind(this)}
                style={{backgroundColor:'white',height:260}}
                />
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                isSetting:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={()=>{

                            if(this.state.list.length==0){
                                this._toast.show('请添加分类')
                                return
                            }
                            var tem=this
                         postFetch(API.SheZhiClassify,{memberCollectDetail:{collectId:this.state.selectId},catalogIds:this.state.list},(result)=>{
                             // alert(JSON.stringify(result))
                             if(result.status==1){
                                 setTimeout(function () {
                                     // tem._toast.show('添加成功')
                                 },500)
                                 this.setState({
                                     isSetting:false
                                 })
                                 this.postFetchs()
                             }
                         },(error)=>{
                             this._toast.show(error)
                         })

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
            </Modal>
            <Modal
                isVisible={this.state.isBianjiName}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isBianjiName: false});

                    }}
                    style={styles.jian}
                />
                <View style={{height:300,width:340,borderRadius:5,alignSelf:'center',}}>
                    <ListView
                        dataSource={this.state.dataSources}
                        renderRow={this._renderBianji.bind(this)}
                        style={{backgroundColor:'white',height:260}}
                    />
                    <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity  onPress={()=>{
                            this.setState({
                                isBianjiName:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={()=>{
                            if(this.state.xuanze==2){
                                this.setState({
                                    isBianjiName:false
                                })
                                this.props.navigation.navigate('BianJiName',{data:this.state.listAllid,callbackimg:(data)=>{this.postFetchs()},callback:(data)=>{this.setState({data:data})}})

                            }else {
                                if(this.state.xuanze==1){
                                    this.setState({
                                        isBianjiName:false
                                    })
                                    postFetch(API.DelectShouCangClassify,{memberCollectCatalog:{id:this.state.listAllid}},(result)=>{
                                        // alert(JSON.stringify(result))
                                        if(result.status==1){
                                            this.postFetchs();
                                        }
                                    },(error)=>{
                                        this._toastb.show(error)
                                    })
                                }
                            }

                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast ref={(e) => {
                    this._toastb = e
                }}
                       position='center'
                />
            </Modal>
            <Modal
                isVisible={this.state.isShowFenXiang}
                hideOnBack={true}
                transparent={true}
                style={styles.fenx}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowFenXiang: false});

                    }}
                    style={styles.jian}
                />
            {/*<FenXiangModel*/}
                {/*fenxiang={this.fenxiang.bind(this,1)}*/}
                {/*pengyouquan={this.fenxiang.bind(this,2)}*/}
                {/*sharefriend={this.fenxiang.bind(this,3)}*/}
                {/*qqkongjian={this.fenxiang.bind(this,4)}*/}
                {/*qqfriend={this.fenxiang.bind(this,5)}*/}
                {/*xinlang={this.fenxiang.bind(this,6)}*/}
            {/*/>*/}
                <View style={{
                    flexDirection: "column",
                    // marginTop: Contants.Screen.height/2,
                    backgroundColor: "white",
                    width: Contants.Screen.width,
                    height: 120,
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
                                <TouchableOpacity style={styles.scrollist} onPress={this.fenxiang.bind(this,1)}>
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/dongtai.png')}/>
                                    </View>
                                    <Text>分享到动态</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollist} onPress={this.fenxiang.bind(this,2)}>
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/weixinf.png')}/>
                                    </View>
                                    <Text>微信朋友圈</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollist} onPress={this.fenxiang.bind(this,3)}>
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/wfriend.png')}/>
                                    </View>
                                    <Text>微信好友</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollist} onPress={this.fenxiang.bind(this,4)}>
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/qqkongj.png')}/>
                                    </View>
                                    <Text>QQ空间</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollist} onPress={this.fenxiang.bind(this,5)}>
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/qqfriend.png')}/>
                                    </View>
                                    <Text>QQ好友</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollist} onPress={this.fenxiang.bind(this,6)}>
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/xinlang.png')}/>
                                    </View>
                                    <Text>新浪微博</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <Toast ref={(e) => {
                this._toastdj = e
            }}
                   position='center'
            />
        </View>)
    }
    selefenxi(){
        this.setState({
            isShowModal:false,
            isShowFenXiang:true
        })
        // setTimeout(()=>{
        //     this.setState({isShowFenXiang:true})
        // },1000)
    }
    fenxiang(index){
        switch (index){
            case 1:{
                this.setState({
                    isShowFenXiang:false
                })
                 this.props.navigation.navigate('ShareToDongTai',{data:this.state.postId})
                break
            }
            case 2:{
                wechat.isWXAppInstalled().then((isInstalled)=>{
                    if(isInstalled){
                        wechat.shareToTimeline({
                            type:'news',
                            title:'MTool商户平台',
                            description:'微信朋友圈分享mtool',
                            webpageUrl: "https://www.baidu.com/",
                            thumbImage:'http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image'
                        }).catch((error)=>{
                            alert(error)
                        })
                    }else {
                        // alert('没有安装微信软件，请您安装微信之后再试')
                        ToastAndroid.show('没有安装微信软件，请您安装微信之后再试', ToastAndroid.SHORT);
                    }
                })
                break
            }
            case 3:{
                wechat.isWXAppInstalled().then((isInstalled)=>{
                    if(isInstalled){
                        wechat.shareToSession({
                            type:'news',
                            title:'MTool商户平台',
                            description:'微信朋友圈分享mtool',
                            webpageUrl: "https://www.baidu.com/",
                            thumbImage:'http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image'
                        }).catch((error)=>{
                            alert(error)
                        })
                    }else {
                        // alert('没有安装微信软件，请您安装微信之后再试');
                        ToastAndroid.show('没有安装微信软件，请您安装微信之后再试', ToastAndroid.SHORT);
                    }
                })
                break
            }
            case 4:{
                UShare.share('mtool','mtool商户端','http://baidu.com','http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image',SharePlatform.QQZONE,(code,message)=>{
                    // alert(code)
                    ToastAndroid.show(code, ToastAndroid.SHORT);
                })
                break
            }
            case 5:{
//1.标题 2.内容 3.跳转链接 4。图片链接 5。分享平台 6.分享结果的回调
                UShare.share('mtool','mtool商户端','http://baidu.com','http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image',SharePlatform.QQ,(code,message)=>{
                    // alert(code)
                    ToastAndroid.show(code, ToastAndroid.SHORT);
                })
                break
            }
            case 6:{
                UShare.share('mtool','mtool商户端','http://baidu.com','http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image',SharePlatform.SINA,(code,message)=>{
                    // alert(code)
                    ToastAndroid.show(code, ToastAndroid.SHORT);
                })
                break
            }
        }
    }
    delectclassify(){
        this.setState({
            xuanze:1,
            isBianjiName:true,
            isModals:false
        })
    }
    bianji(){
        this.setState({
            isBianjiName:true,
            isModals:false,
            xuanze:2
        })
    }
    _renderBianji(rowData,sectionID,rowID){
        return(<View style={styles.you}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:46,backgroundColor:'white'}}>
                <Text style={comstyle.maleft}>{rowData.name}</Text>
                {/*<CheckBox onChange={this._change.bind(this,rowData.id)} style={{marginRight:20}}/>*/}
                <TouchableOpacity onPress={()=>{this._selectRow(rowData,rowID)}}>
                    <Image source={rowData.isCheck==true?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} style={comstyle.textright}/>

                </TouchableOpacity>
            </View>
            <View style={comstyle.heng}/>
        </View>)
    }
    _selectRow(item,index){
        if(item.isCheck){
            this.LetAll[index]['isCheck']=false;
            mSelectWhat=-1
        }else {
            this.LetAll.map((o,i)=>{
                if(i==index){
                    this.LetAll[i]['isCheck']=true
                    mSelectWhat=i;
                    // alert(JSON.stringify(this.LetAll[i]['isCheck']))
                    // if(this.LetAll[i]['isCheck'])==true)
                    if(this.LetAll[i]['isCheck']==true){
                        // alert(JSON.stringify(this.LetAll[i]['id']))
                        this.setState({
                            listAllid:this.LetAll[i]['id']
                        })

                    }
                }else {
                    this.LetAll[i]['isCheck']=false
                }
            })
        }

        this.setState({

            dataSources:this.state.dataSources.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
        })

    }
    quitshoucang(){
      postFetch(API.QuXiaoDongTaiShouCang,{forumPostCollect:{postId:this.state.postId}},(result)=>{
          // alert(JSON.stringify(result))
          if(result.status==1){
              this._toasts.show(result.msg);
              this.setState({
                  isShowModal:false,
              })
              this.postFetchs();
          }
      },(error)=>{
          this._toasts.show(error)
      })
    }
    _renderchang(rowData){
        return(<View style={styles.you}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:46,backgroundColor:'white'}}>
                <Text style={comstyle.maleft}>{rowData.name}</Text>
                <CheckBox onChange={this._change.bind(this,rowData.id)} style={{marginRight:20}}/>
            </View>
            <View style={comstyle.heng}/>
        </View>)
    }
    _change(info){
        // alert(JSON.stringify(this.state.imgurls))

        var dou=false
        for (var i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i] == info) {
                dou=true
            }
        }
        if(!dou){
            this.state.list.push(info)
        }else {
            for (var i = 0; i < this.state.list.length; i++) {
                if (this.state.list[i] == info) {
                    this.state.list.splice(i,1)
                }
            }
        }

    }
    dianjis(rowData){
        // alert(JSON.stringify(rowData.content))
        if(list===''){
            this.props.navigation.navigate('DongTaiDetails',{data:rowData.id})
        }else {
           const str={
              id:rowData.id.toString(),
               content:rowData.content,
               img:rowData.resourceIsNull==1?rowData.forumThreadResources[0].resourceUrl:''
           }
            this.props.navigation.state.params.callbacks(str)

            this.props.navigation.goBack();
        }

    }
    _renderRow=(rowData, rowId, sectionId)=>{
        flatlist=rowData.resourceIsNull==1?rowData.forumThreadResources.length:null
        // alert(rowId)
        // alert(JSON.stringify(rowData))
        bigimage=rowData.resourceIsNull==1?rowData.forumThreadResources:null
        return(
            <TouchableOpacity key={rowId} onPress={this.dianjis.bind(this,rowData)} style={styles.toux}>

                <View style={[styles.item,{justifyContent:'space-between'}]}>
                    <View style={comstyle.rightview}>
                        <Image source={{uri:rowData.userMember&&rowData.userMember.picUrl}} style={styles.image}/>
                        <View style={styles.chixu}>
                            <Text>{rowData.userMember&&rowData.userMember.nickname}</Text>
                            {/*<Text>{rowData.createTime}</Text>*/}
                            <Text style={{fontSize:10,color:'#B2B2B2'}}>{new Date(rowData.createTime).getHours()+'小时前'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{height:40,width:40,alignItems:'center',justifyContent:'center',}} onPress={this.tanchuang.bind(this,rowData.collectId,rowData.id,rowId)}>
                        <Image source={require('../../../img/pinglun/shenglh.png')} style={{marginRight:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={{width:335,height:1,backgroundColor:'#E5E5E5',alignSelf:'center',marginBottom:10}}/>
                <View style={{flexDirection:'column',alignItems:'center'}}>

                    {rowData.resourceIsNull==1? <View style={styles.tupian}>
                        <ListView
                            dataSource={this.state.dataSourceimg.cloneWithRows(rowData.forumThreadResources)}
                            renderRow={this.renderimg}
                            removeClippedSubviews={false}
                            // horizontal={true}
                            contentContainerStyle={styles.consty}
                            enableEmptySections={true}
                            style={{backgroundColor:'white',marginLeft:7}}
                        />
                    </View>:null}


                    <View style={styles.item}>


                        <View style={styles.you}>
                            <View style={styles.kai}>
                                <Text style={{marginLeft:20}}>{rowData.content}</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    renderimg=(rowData,sectionID,rowID)=>{
        var convert=null
        if(flatlist==1){

            if(rowData.type==undefined || rowData.type==0){

                convert=(<TouchableOpacity onPress={this.fets.bind(this,bigimage)}>
                    <Image source={{uri:rowData.resourceUrl}} style={styles.fenmians}/>
                </TouchableOpacity>)
                // })
            }else {
                convert=(<TouchableOpacity onPress={this.fenmina.bind(this,rowData)}>
                    <Image source={{uri:rowData.coverUrl}} style={[styles.fenmianvideo]}>
                        <Image source={require('../../../img/pinglun/bofang.png')}/>
                    </Image>
                </TouchableOpacity>)
            }
        }else {
            // ImageResizer.createResizedImage(rowData.resourceUrl,200,200,"PNG", 80,0).then((response)=>{
            convert=( <TouchableOpacity onPress={this.fets.bind(this,bigimage)}>
                <Image source={{uri:rowData.resourceUrl}} style={styles.fenmian}/>
            </TouchableOpacity>)
            // })
        }
        return(<View style={{flexDirection:'row',flexWrap:'wrap'}} key={rowID}>
            {/*{rowData.type==0?*/}
                {/*<Image source={{uri:rowData.resourceUrl}} style={flatlist===1?styles.fenmians:styles.fenmian}/>*/}
                {/*:*/}
                {/*<TouchableOpacity onPress={this.fenmina.bind(this,rowData)}>*/}
                    {/*<Image source={{uri:rowData.coverUrl}} style={styles.fenmians}/>*/}
                {/*</TouchableOpacity>*/}
            {/*}*/}
            {convert}
        </View>)
    }
    fets(rowData){
        let items = [];
        rowData.map((item,index)=>{
            items.push({source:{uri:item.resourceUrl}})
            // 把需要的参数push进去
        })
        this.props.navigation.navigate('CeShiImage',{data:items})
    }
    fenmina(rowData){
        WatchVideo.playVideo(rowData.coverUrl,rowData.resourceUrl);
    }
    tanchuang(rowData,postid,rowId){
    this.setState({
        isShowModal:true,
        selectId:rowData,
        postId:postid,

    })
        // alert(rowData)
    }
    _renderSection=(section, sectionId)=>{

        return(
            <View
                style={{ height: 46, flexDirection: 'row',marginTop:3,
                    justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5,
                    borderBottomColor: "#E5E5E5",backgroundColor:'white',}}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: "#282828",marginLeft:20}}>
                        {section}
                    </Text>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} key={sectionId} onPress={this.select.bind(this,sectionId)}>
                   <Image  source={require('../../../img/tools/jiantou.png')} style={comstyle.textright}/>
                </TouchableOpacity>
            </View>
        )
    }
    select(sectionId){

        this.state.isselect!=this.state.isselect

    }
    renderHeader(){
        return(

            <View style={styles.headercontainers}>
                <TouchableOpacity style={styles.btncon} onPress={()=>{
                    this.setState({
                        isModals:true
                    })
                }}>

                    <Image source={require("../../../img/page/button.png")} style={styles.btnimg}/>
                </TouchableOpacity>
            </View>

        )
    }
    publicord(){
        this.props.navigation.navigate("Login")
        this.setState({
            isModals:false
        })
    }
    searchview(){
        // this.props.navigation.navigate("SearchView")
        this.setState({
            isModals:false
        })
    }
    dingdan(){
        this.props.navigation.navigate('Index')
        this.setState({
            isModals:false
        })
    }
    settingview(){
        this.props.navigation.navigate('MessageMain')
        this.setState({
            isModals:false
        })
    }
    news(){
        this.props.navigation.navigate('NewsMain',{data:0})
        this.setState({
            isModals:false
        })
    }
    hexiao(){
        this.props.navigation.navigate('HeXiaoView')
        this.setState({
            isModals:false
        })
    }
    gongju(){
        this.props.navigation.navigate('ToolsService',{data:0})
        this.setState({
            isModals:false
        })
    }
}
const styles=StyleSheet.create({
    toux:{
        // backgroundColor:'white',
        flexDirection:'column',
        // height:Contants.Screen.height/6,
        marginTop:10
        ,backgroundColor:'white'
    },
    item:{
        flexDirection:'row',
        flex:1,

        alignItems:'center',
        marginTop:10,
        marginBottom:10
    },
    chixu:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    kai:{
        flexDirection:'row',
        flex:1,
        width:Contants.Screen.width,
        margin:4
    },
    kais:{
        flexDirection:'row',
        justifyContent:'flex-end',
        flex:1,
        width:Contants.Screen.width
    },
    you:{
        flexDirection:'column'
    },
    image:{
        width:35,
        height:35,
        marginRight:10,
        marginLeft:20,
        borderRadius:4
    },
    // modalstyle:{
    //     backgroundColor:"transparent",
    //     // margin:0,
    //     position:'absolute',
    //     // marginLeft:Contants.Screen.width/2+80,
    //     // marginTop:20
    //     justifyContent:'center',
    //     alignSelf:'center',
    //     marginTop:Contants.Screen.height/3-30
    //     // height:380
    //
    // },
    itemlist:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
         height:43
    },
    //导航栏样式
    headerContainer: {

        height: 60,
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 0,
        width: "100%",
        marginTop:0

    },

    leftImgBtn: {


        width: 105,
        height: 55,
        alignItems: "flex-end",
        justifyContent: "center",
        // marginLeft:Contents.Screen.width/3+30,
        // position:'absolute',
        alignSelf:'flex-end',
        marginRight:Contants.Screen.width/6+25.5,
    },

    middleTitle: {

        fontSize: 18,
        marginLeft:20,
    },
    modalstyles:{
        backgroundColor:"transparent",
        margin:0,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        marginTop:10,
        alignSelf:'flex-end',
    },
    btnimg:{
        width:60,
        height:60,
        marginRight:20
    },
    btncon:{
        marginTop:10,
        alignItems:"center",
        justifyContent:"center",
        marginBottom:30,
        zIndex:10
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
    headercontainers:{
        zIndex:1000,
        marginBottom:40,
        position:'absolute',
        // marginLeft:Contants.Screen.width/2+80,
        marginTop:0,
        alignSelf:'flex-end',
    },
    btnimgs:{
        width:60,
        height:60,
        marginTop:5
    },
    tupian:{
        width:Contants.Screen.width,
        flexDirection:'row'
        ,flexWrap:'wrap',
        backgroundColor:'white',
    },
    consty:{
        flexWrap:'wrap',
        flexDirection:'row',
        backgroundColor:'white'
    },
    fenmian:{
        width:100,height:100,marginTop:7,marginLeft:7,marginRight:10,borderRadius:4
    },
    fenmians:{
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5
    },
    fenx:{
        justifyContent:'flex-end',margin:0
    },
    jian:{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0
    },
    fenmianvideo:{
        backgroundColor:'gray',
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5,
        justifyContent:'center',alignItems:'center',
    },
    border:{
        height:57,width:57,borderWidth:1,borderRadius:6,borderColor:'#E5E5E5',
        justifyContent:'center',alignItems:'center',
    },
    scrollist:{
        flexDirection:'column',alignItems:'center',marginTop:20,marginLeft:10,marginRight:10,marginBottom:20
    },
})