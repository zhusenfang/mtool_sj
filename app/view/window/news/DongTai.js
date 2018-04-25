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
    ListView,
    RefreshControl,
    ActivityIndicator,
    ScrollView,
    DeviceEventEmitter,
    BackHandler,
    Platform,
    ToastAndroid
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants';
import Modal from 'react-native-modal';
import MyCheckView from '../../../common/MyCheckView'
import *as wechat from 'react-native-wechat'
import Storage from '../../../common/GGAsyncStorage'
import Toast from "react-native-easy-toast";
import RadioModal from 'react-native-radio-master';
import WatchVideo from '../../nativeModuals/WatchVideo'
import ImageResizer from 'react-native-image-resizer';
import UShare from '../../../view/share/share';
import SharePlatform from '../../../view/share/SharePlatform'
let datas
let flags = 0
var mSelectWhat = -1;
var mSelectWhats = -1;
var mSelectWhatf =-1
var flatlist=''
var list=[
    {text:'社交圈',id:'社交圈',img:require('../../../img/dian/shejiaopress.png'),unimg:require('../../../img/dian/shejiaounpress.png')},
    {text:'我的朋友',id:'我的朋友',img:require('../../../img/dian/friendpress.png'),unimg:require('../../../img/dian/friendunpress.png')},
    {text:'自定义分类',id:'自定义分类',img:require('../../../img/dian/zdypress.png'),unimg:require('../../../img/dian/zdyunpress.png')},
];
var bigimage=[]
export default class DongTai extends Component{
    constructor(props){
        super(props)
         this.state={
            data:[],
             // dataSource: new ListView.DataSource({
             //     rowHasChanged: (row1, row2) => row1 !== row2,
             // }),
             dataSources: new ListView.DataSource({
                 rowHasChanged: (row1, row2) => row1 !== row2,
             }),
             isRefreshing:false,
             hasNextPage: false,
             isFistLoad:true,
             pageIndex: 0,
             dataArray:[],
             array:[],
             isLoading:false,
             isShowModal:false,
             rowId:'',
             delectId:'',
            bigimg:null,
            list:[],
             clicknum:0,
             tags:"",
             isShowLong:false,
             shoucangId:'',
             isShouCang:false,
             shourowId:'',
             isShowQuan:false,
             initItem:'全 部',
             initId:'',
             collectType:'',
             ids:'',
             isGreat:false,
             isSupport:'',
             follow:0,
             dataSourceimg: new ListView.DataSource({
                 rowHasChanged: (row1, row2) => row1 !== row2,
             }),
             fengmian:'',
             dataSourceModal: new ListView.DataSource({
                 rowHasChanged: (row1, row2) => row1 !== row2,
             }),
             frouttype:'',
             followType:'',
             guanzhuuserid:'',
             friendid:1,
             introduce:false,
             dataSourceBiao: new ListView.DataSource({
                 rowHasChanged: (row1, row2) => row1 !== row2,
             }),
             biaoqianid:'',
             // imageth:''
         }
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
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        // alert(this.state.follow)
        Storage.get("userId").then((tagss)=>{

            this.setState({
                tags:tagss
            })
        })

        wechat.registerApp('wx1ccb336f561e993d')
        this.fetchData(1,1)
        this.setState({
            isRefreshing:true,
            isGreat:true,
        })
        // DeviceEventEmitter.addListener('onCoverImage',this.onResult)
        var Let=list;
        list.map((o,i)=>{
            if(!this.props.mID){
                Let[i]['selected']=false
            }else {
                if(this.props.mID=o.user_id){
                    Let[i]['selected']=true
                }else {
                    Let[i]['selected']=false
                }
            }
        })
        this.Let=Let
        this.setState({
            dataSourceModal:this.state.dataSourceModal.cloneWithRows(JSON.parse(JSON.stringify(this.Let)))
        })
        postFetch(API.BiaoQianGuanli,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){

                var LetAllf=result.data;
                result.data.map((o,i)=>{
                    if(!this.props.mID){
                        LetAllf[i]['isCheck']=false
                    }else {
                        if(this.props.mID==o.user_id){
                            LetAllf[i]['isCheck']=true
                        }else {
                            LetAllf[i]['isCheck']=false
                        }
                    }
                })
                this.LetAllf=LetAllf
                this.setState({
                    dataSourceBiao:this.state.dataSourceBiao.cloneWithRows(JSON.parse(JSON.stringify(this.LetAllf))),

                })
                // this.setState({
                //     dataSourceBiao:this.state.dataSourceBiao.cloneWithRows(result.data),
                // })

            }
        })
    }
    // onResult=(e)=>{
    //     this.setState({
    //         fengmian:e
    //     })
    // }
    fetchData(page,index,id){
        // this.setState({
        //     follow:this.state.initId
        // })
        postFetch(API.DongTai,{pageNum:page,numPerPage:6,follow:index,labelId:id},(result)=>{

             // alert(JSON.stringify(result))
            this.setState({
                isRefreshing:false
            })
            if(result.status==1){
            if(page==1){
                this.setState({
                    array:result.data,
                    // data:result.data
                    dataArray:result.data,
                    dataSources:this.state.dataSources.cloneWithRows(result.data)
                })
            }else {
                this.setState({
                    isLoading:true,
                    dataArray:this.state.dataArray.concat(result.data),
                    dataSources:this.state.dataSources.cloneWithRows(this.state.dataArray.concat(result.data)),
                    array:result.data,
                })
            }
            }
        })
    }
    componentDidUpdate(){
        // this.setState({
        //     follow:this.state.initId
        // })
        // alert(this.state.follow)
    }
    render(){

        // console.warn(this.state.data)
        // alert(JSON.stringify(this.state.dataSources))
        return(
            <View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            {/*<FlatList data={this.state.data}*/}
            {/*renderItem={this.renderItem.bind(this)}*/}
                {/*refreshing={this.state.isRefreshing}*/}
                {/*onRefresh={this._onRefresh.bind(this)}*/}
                {/*onEndReached={this._fetchMoreData.bind(this)}*/}
                      {/*onEndReachedThreshold={2}*/}
                      {/*style={{height:Contants.Screen.height-400}}*/}
            {/*/>*/}

            <ListView
                style={{marginTop:10}}
            dataSource={this.state.dataSources}
            renderRow={this.renderItem.bind(this)}
            automaticallyAdjustContentInsets={false}
            onEndReached={this._fetchMoreData.bind(this)}
            onEndReachedThreshold={7}
            renderFooter={this._renderfoot}
            enableEmptySections={true}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh.bind(this)}
                />
            }
            />
                <TouchableOpacity style={styles.matop} onPress={()=>{this.setState({isShowQuan:true})}}>
                  <Image source={require('../../../img/pinglun/shaixuanpress.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={{zIndex:100,position:'absolute',justifyContent:'flex-end',flexDirection:'column',alignItems:'flex-end',alignSelf:'flex-end',marginTop:Contants.Screen.height-150,
               }} onPress={this.dongtai.bind(this)}>
                  <Image source={require('../../../img/pinglun/dibu.png')} style={{marginRight:20}}/>
                </TouchableOpacity>
                <Modal
                    isVisible={this.state.isShowQuan}
                    hideOnBack={true}
                    transparent={true}
                    style={{justifyContent:'flex-start',margin:0}}
                    //backdropColor='transferent'
                    backdropOpacity={0.3}
                    animationIn={'slideInRight'}
                    animationOut={'slideOutRight'}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isShowQuan: false});

                        }}
                        style={styles.jian}
                    />
                    <View style={styles.topview}>

                            <ListView
                            dataSource={this.state.dataSourceModal}
                            renderRow={this.renderModal}
                            enableEmptySections={true}
                            />
                        {/*</View>*/}
                        <TouchableOpacity style={{flexDirection:'column',justifyContent:'flex-start',width:50,alignItems:'center',marginTop:20}}
                        onPress={()=>{
                            this.setState({isShowQuan:false,

                            })

                        }
                        }>
                           <Image source={require('../../../img/pinglun/cha.png')}/>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.isShowModal}
                    hideOnBack={true}
                    transparent={true}
                    style={{justifyContent:'flex-end',margin:0}}
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
                        <TouchableOpacity style={styles.scrollist} onPress={this.sharetodongtai.bind(this)}>
                            <View style={styles.border}>
                            <Image source={require('../../../img/pinglun/dongtai.png')}/>
                            </View>
                            <Text>分享到动态</Text>
                        </TouchableOpacity>
                        {/*<View style={styles.scrollist}>*/}
                            {/*<View style={styles.border}>*/}
                            {/*<Image source={require('../../../img/pinglun/fenxiang.png')}/>*/}
                            {/*</View>*/}
                            {/*<Text>分享给朋友</Text>*/}
                        {/*</View>*/}
                        <TouchableOpacity style={styles.scrollist} onPress={this.pengyouquan.bind(this)}>
                            <View style={styles.border}>
                            <Image source={require('../../../img/pinglun/weixinf.png')}/>
                            </View>
                            <Text>微信朋友圈</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollist} onPress={this.sharefriend.bind(this)}>
                            <View style={styles.border}>
                            <Image source={require('../../../img/pinglun/wfriend.png')}/>
                            </View>
                            <Text>微信好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollist} onPress={this.qqkongjian.bind(this)}>
                            <View style={styles.border}>
                            <Image source={require('../../../img/pinglun/qqkongj.png')}/>
                            </View>
                            <Text>QQ空间</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollist} onPress={this.qqfriend.bind(this)}>
                            <View style={styles.border}>
                            <Image source={require('../../../img/pinglun/qqfriend.png')}/>
                            </View>
                            <Text>QQ好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.scrollist} onPress={this.xinlang.bind(this)}>
                            <View style={styles.border}>
                            <Image source={require('../../../img/pinglun/xinlang.png')}/>
                            </View>
                            <Text>新浪微博</Text>
                        </TouchableOpacity>
                        </View>

                    </ScrollView>
                        </View>
                        <View style={comstyle.heng}/>
                        <View style={{flexDirection:'column'}}>
                        <View style={{flexDirection:'row',marginTop:20,marginBottom:20}}>
                            <View style={{flexDirection:'column',alignItems:'center',marginTop:0,marginLeft:10,marginRight:10}}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/fuzhil.png')}/>
                                </View>
                                <Text>复制链接</Text>
                            </View>
                            <TouchableOpacity style={{flexDirection:'column',alignItems:'center',marginTop:0,marginLeft:10,marginRight:10}} onPress={this.delect.bind(this)}>
                                <View style={styles.border}>
                                    <Image source={require('../../../img/pinglun/shanchu.png')}/>
                                </View>
                                <Text>删除</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={comstyle.heng}/>
                            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:"center"}}
                            onPress={()=>{
                                this.setState({
                                    isShowModal:false
                                })
                            }}
                            >
                            <Text style={{alignSelf:'center',marginTop:10}}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
                <Modal
                    isVisible={this.state.isShowLong}
                    hideOnBack={true}
                    transparent={true}
                    style={{justifyContent:'flex-end',margin:0}}
                    //backdropColor='transferent'
                    backdropOpacity={0.3}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isShowLong: false});

                        }}
                        style={styles.jian}
                    />
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
                                    <TouchableOpacity style={styles.scrollist} onPress={this.sharetodongtai.bind(this)}>
                                        <View style={styles.border}>
                                            <Image source={require('../../../img/pinglun/dongtai.png')}/>
                                        </View>
                                        <Text>分享到动态</Text>
                                    </TouchableOpacity>
                                    {/*<View style={styles.scrollist}>*/}
                                        {/*<View style={styles.border}>*/}
                                            {/*<Image source={require('../../../img/pinglun/fenxiang.png')}/>*/}
                                        {/*</View>*/}
                                        {/*<Text>分享给朋友</Text>*/}
                                    {/*</View>*/}
                                    <TouchableOpacity style={styles.scrollist} onPress={this.pengyouquan.bind(this)}>
                                        <View style={styles.border}>
                                            <Image source={require('../../../img/pinglun/weixinf.png')}/>
                                        </View>
                                        <Text>微信朋友圈</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.scrollist} onPress={this.sharefriend.bind(this)}>
                                        <View style={styles.border}>
                                            <Image source={require('../../../img/pinglun/wfriend.png')}/>
                                        </View>
                                        <Text>微信好友</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.scrollist} onPress={this.qqkongjian.bind(this)}>
                                        <View style={styles.border}>
                                            <Image source={require('../../../img/pinglun/qqkongj.png')}/>
                                        </View>
                                        <Text>QQ空间</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.scrollist} onPress={this.qqfriend.bind(this)}>
                                        <View style={styles.border}>
                                            <Image source={require('../../../img/pinglun/qqfriend.png')}/>
                                        </View>
                                        <Text>QQ好友</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.scrollist} onPress={this.xinlang.bind(this)}>
                                        <View style={styles.border}>
                                            <Image source={require('../../../img/pinglun/xinlang.png')}/>
                                        </View>
                                        <Text>新浪微博</Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>
                        </View>
                        <View style={comstyle.heng}/>
                        <View style={{flexDirection:'column'}}>
                            <View style={{flexDirection:'row',marginTop:20,marginBottom:20}}>
                                <View style={styles.scrollists}>
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/fuzhil.png')}/>
                                    </View>
                                    <Text>复制链接</Text>
                                </View>
                                <TouchableOpacity style={styles.scrollists} onPress={this.shoucang.bind(this)}>
                                    <View style={styles.border}>
                                        <Image source={this.state.collectType==0?require('../../../img/pinglun/shoucangs.png'):require('../../../img/pinglun/shoucangspress.png')}/>

                                    </View>
                                    <Text>收藏</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollists} onPress={this.guanzhuuse.bind(this)}>
                                    <View style={styles.border}>
                                        <Image source={this.state.followType==0?require('../../../img/pinglun/guanzhu.png'):require('../../../img/pinglun/guanzhupress.png')}/>
                                    </View>
                                    <Text>关注</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollists} >
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/buzaikan.png')}/>
                                    </View>
                                    <Text>不再看</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.scrollists} >
                                    <View style={styles.border}>
                                        <Image source={require('../../../img/pinglun/jubao.png')}/>
                                    </View>
                                    <Text>举报</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={comstyle.heng}/>
                            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:"center"}}
                                              onPress={()=>{
                                                  this.setState({
                                                      isShowLong:false
                                                  })
                                              }}
                            >
                                <Text style={{alignSelf:'center',marginTop:10}}>取消</Text>
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
                    isVisible={this.state.introduce}
                    hideOnBack={true}
                    transparent={true}
                    backdropOpacity={0.3}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                introduce:false
                            })
                        }}
                        style={styles.jian}
                    />
                    <View style={{backgroundColor:'white',borderWidth:1,borderRadius:5,borderColor:"#E7E7E7"}}>
                        <Text style={{margin:10,color:'#282828',fontSize:14}}>选择标签</Text>
                        <View style={comstyle.heng}/>
                        <ListView
                            dataSource={this.state.dataSourceBiao}
                            renderRow={this.renderRowClassify}
                            style={{height:300}}
                        />
                        <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5',marginTop:15}}/>
                        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                            <TouchableOpacity  onPress={()=>{
                               this.setState({introduce:false})
                            }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text style={comstyle.text}>返回</Text>
                            </TouchableOpacity>
                            <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                            <TouchableOpacity  onPress={this.surebtn.bind(this)} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                <Text style={comstyle.text}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Toast ref={(e) => {
                    this._toastf = e
                }}
                       position='center'
                />
        </View>)
    }
    renderRowClassify=(rowData,sectionID,rowID)=>{
        // alert(JSON.stringify(rowData))
        return(<View style={{flexDirection:'column',}}>
            <View style={[{marginTop:15,marginBottom:15,height:2,backgroundColor:'#E5E5E5'}]}/>
            <TouchableOpacity style={{flexDirection:'row',height:35,borderColor:'#E5E5E5',borderRadius:4,borderWidth:1,justifyContent:'space-between',alignItems:'center',
                marginLeft:20,marginRight:20
            }}
                              onPress={this.selectRowClassify.bind(this,rowData,rowID)}>
                <Text style={[comstyle.text,{marginLeft:12}]}>{rowData.name}</Text>
                <Image source={rowData.isCheck==true?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} style={{marginRight:12}}/>
            </TouchableOpacity>
        </View>)
    }

    surebtn(){

        this.fetchData(1,2,this.state.biaoqianid)
        this.setState({
            introduce:false
        })
    }
    selectRowClassify=(item,index)=>{
        if(item.isCheck){
            this.LetAllf[index]['isCheck']=false;
            mSelectWhatf=-1
        }else {
            this.LetAllf.map((o,i)=>{
                if(i==index){
                    this.LetAllf[i]['isCheck']=true
                    mSelectWhatf=i;
                    if(this.LetAllf[i]['isCheck']==true){
                         this.setState({
                             biaoqianid:this.LetAllf[i]['id']
                         })
                        // alert(JSON.stringify(this.LetAllf[i]['id']))
                    }
                }else {
                    this.LetAllf[i]['isCheck']=false
                }
            })
        }

        this.setState({
            dataSourceBiao:this.state.dataSourceBiao.cloneWithRows(JSON.parse(JSON.stringify(this.LetAllf)))
        })
    }
    chooseBiaoQian(){
        // alert('ss')
        this.setState({
            introduce:true
        })

    }
    guanzhuuse(){
        // alert(this.state.followType)
       if(this.state.followType==0){
           postFetch(API.GuanZhuUser,{idolId:this.state.guanzhuuserid},(result)=>{
               // alert(JSON.stringify(result))
               this.setState({
                   followType:1
               })
               this._toast.show(result.msg)
           },(error)=>{
               alert(error)
           })
       }else {
           postFetch(API.QuXiaoGuanZhuUser,{idolId:this.state.guanzhuuserid},(result)=>{
               // alert(JSON.stringify(result))
               this.setState({
                   followType:0
               })
               this._toast.show(result.msg)
           },(error)=>{
               alert(error)
           })
       }

    }

    renderModal=(rowData,sectionID,rowID)=>{
        return(
            <View style={styles.shui}>
            <TouchableOpacity style={styles.shehui} onPress={this.selectmodal.bind(this,rowData,rowID)}>
                <Image source={rowData.selected==true?rowData.img:rowData.unimg} style={styles.imgtext}/>
                <Text style={{color:rowData.selected==true?'#FF305E':'#282828',marginLeft:15}}>{rowData.text}</Text>
            </TouchableOpacity>
                <Image source={require('../../../img/tools/xuxian.png')}/>
            </View>
        )
    }
    selectmodal(item,index){
        if(item.selected){
            this.Let[index]['selected']=false
            mSelectWhats = -1;
        }else {
            this.Let.map((o,i)=>{
                if(i==index){
                    this.Let[i]['selected']=true
                    mSelectWhats=i;
                    if(this.Let[i]['selected']==true){
                        // alert(JSON.stringify(this.Let[i]['text']))
                        this.setState({
                            // frouttype:this.Let[i]['text']
                            isShowQuan:false,
                        })
                        if(this.Let[i]['text']==='社交圈'){
                            this.setState({
                                pageIndex:1,
                                friendid:1
                            })
                            this.fetchData(1,1)
                        }else if(this.Let[i]['text']==='我的朋友'){
                                this.setState({
                                    pageIndex:1,
                                    friendid:0
                                })
                                this.fetchData(1,0)
                            }else if(this.Let[i]['text']==='自定义分类'){
                                    this.setState({
                                        pageIndex:1,
                                        friendid:2
                                    })

                            this.chooseBiaoQian()
                                }




                    }
                }else {
                    this.Let[i]['selected']=false
                }
            })
        }
        this.setState({
            dataSourceModal:this.state.dataSourceModal.cloneWithRows(JSON.parse(JSON.stringify(this.Let)))
        })
    }
    sharetodongtai(){
        if(this.state.delectId==this.state.tags){
            this.setState({
                isShowModal:false
            })
            this.props.navigation.navigate('ShareToDongTai',{data:this.state.delectId,callbacks:(data)=>{
                // alert(data)
                this.fetchData(1,1)
            }})
        }else {
            this.setState({
                isShowLong:false
            })
            this.props.navigation.navigate('ShareToDongTai',{data:this.state.shoucangId,callbacks:(data)=>{
                // alert(data)
                this.fetchData(1,1)
            }})
        }


    }
    qqfriend(){
        //1.标题 2.内容 3.跳转链接 4。图片链接 5。分享平台 6.分享结果的回调
        UShare.share('mtool','mtool商户端','http://baidu.com','http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image',SharePlatform.QQ,(code,message)=>{
            // alert(code)
            ToastAndroid.show(code, ToastAndroid.SHORT);
        })
    }
    qqkongjian(){
        UShare.share('mtool','mtool商户端','http://baidu.com','http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image',SharePlatform.QQZONE,(code,message)=>{
            // alert(code)
            ToastAndroid.show(code, ToastAndroid.SHORT);
        })
    }
    xinlang(){
        UShare.share('mtool','mtool商户端','http://baidu.com','http://122.112.196.52:8080/fileService/uploads/2018/01/29/15172295218169.image',SharePlatform.SINA,(code,message)=>{
            // alert(code)
            ToastAndroid.show(code, ToastAndroid.SHORT);
        })
    }
    pengyouquan(){
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
    }
    sharefriend(){
        var thumbImage = "http://120.76.31.198:83/Content/Images/logo.png";

        // var webpageUrl = "http://www.misspao.com/share/share.html?orderId"+this.props.data.orderId+"&userId="+userId;

        var shareTitle = "我在MTool订餐";

        // wechat.isWXAppInstalled().then((isInstalled) => {
        //     if (isInstalled) {
        //         weChat.shareToSession({
        //             // thumbImage: thumbImage,
        //             type: 'text',
        //             // title: shareTitle,
        //             description: '欢迎体验MTool',
        //             // webpageUrl: webpageUrl,
        //         }).then((result)=>{
        //
        //
        //         })
        //             .catch((error) => {
        //                 alert(error)
        //             });
        //     } else {
        //         alert('没有安装微信软件，请您安装微信之后再试');
        //     }
        // });
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
    }
    shoucang(){

        if(this.state.collectType==0){
            postFetch(API.DongTaiShouCang,{postId:this.state.shoucangId},(result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    this.setState({
                        collectType:1
                    })
                    this._toast.show(result.msg)
                }
            },(error)=>{
                this._toast.show(error)
            })
        }else {
            postFetch(API.QuXiaoDongTaiShouCang,{forumPostCollect:{postId:this.state.shoucangId}},(result)=>{
                // alert(JSON.stringify(result))
                if(result.status==1){
                    this.setState({
                        collectType:0
                    })
                    this._toast.show(result.msg)
                }
            },(error)=>{
                this._toast.show(error)
            })
        }
    }
    delect(){
       delete this.state.dataArray[this.state.rowId]
        // alert(JSON.stringify(this.state.rowId))

        this.setState({
            dataSources:this.state.dataSources.cloneWithRows(this.state.dataArray)
        })
        postFetch(API.ShanChuDongTai,{ids:[this.state.delectId]},(result)=>{
            // alert(JSON.stringify(result))
        },(error)=>{
            alert(error)
        })
    }
    dongtai(){
        this.props.navigation.navigate('ReportDongTai')
    }
    renderItem(rowData,sectionID,rowID){
      flatlist=rowData.resourceIsNull==1?this.state.dataArray[rowID].forumThreadResources.length:null
        bigimage=rowData.resourceIsNull==1?this.state.dataArray[rowID].forumThreadResources:null
        return(
            <TouchableOpacity style={styles.toux} onPress={this.dongtaidetail.bind(this,rowData.id)}>
                <View style={[styles.item,{justifyContent:'space-between'}]}>
                    <View style={comstyle.rightview}>
                        <TouchableOpacity onPress={this.userdetail.bind(this,rowData.userMember.id)}>
                    <Image source={{uri:rowData.userMember&&rowData.userMember.picUrl}} style={styles.image}/>
                        </TouchableOpacity>
                    <View style={styles.chixu}>
                        <Text style={{fontSize:12,color:'#282828'}}>{rowData.userMember&&rowData.userMember.nickname}</Text>
                        {/*<Text>{rowData.createTime}</Text>*/}
                        <Text style={{fontSize:10,color:'#B2B2B2'}}>{new Date(rowData.createTime).getHours()+'小时前'}</Text>
                    </View>
                    </View>
                    <TouchableOpacity onPress={this.sheng.bind(this,rowData,rowID)} style={{height:40,width:40,alignItems:'center',justifyContent:'center',}}>
                    <Image source={require('../../../img/pinglun/shenglh.png')} style={{marginRight:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={{width:335,height:1,backgroundColor:'#E5E5E5',alignSelf:'center',marginBottom:10}}/>
                {rowData.shareType==1?<View style={styles.yuanzhu}>
                    <View style={comstyle.leftview}>
                    <Text style={styles.yuan}>引用原著/</Text>
                    <Text style={[comstyle.text,comstyle.textright]}>{rowData.firstName}</Text>
                    </View>
                </View>:<View/>}
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
                            <Text style={styles.context} numberOfLines={2}>{rowData.content}</Text>
                        </View>
                        <View style={styles.kais}>
                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('DongTaiDetails',{data:rowData.id,id:1})}}>
                            <Image source={require('../../../img/pinglun/pinglun.png')}/>
                            </TouchableOpacity>
                            <Text style={styles.pingluntext}>{rowData.opposes}</Text>
                            <TouchableOpacity onPress={this.dianzan.bind(this,rowData,rowID)}>
                            {/*<Image source={rowData.suppoppType==0?require('../../../img/pinglun/dianzan.png'):require('../../../img/pinglun/dianzanpress.png')} />*/}
                            <Image source={rowData.suppoppType==0?require('../../../img/pinglun/dianzan.png'):require('../../../img/pinglun/dianzanpress.png')}/>
                            {/*<MyCheckView onChange={this.dianzan.bind(this,rowData,rowID)}/>*/}
                            </TouchableOpacity>
                            {/*<Text style={{marginRight:20}}>{rowData.suppoppType==0?rowData.supports:rowData.supports+1}</Text>*/}
                            <Text style={styles.pingluntext}>{rowData.supports}</Text>
                        </View>
                    </View>
                </View>
                </View>
            </TouchableOpacity>
        )
    }
    userdetail(id){
        this.props.navigation.navigate('UserDetails',{data:id,pagenum:this.state.pageIndex==0?1:this.state.pageIndex,numpage:6})
    }

    renderimg=(rowData,sectionID,rowID,url)=>{
        var convert=null
        if(flatlist==1){

            if(rowData.type==undefined || rowData.type==0){
                // this.images(rowData.resourceUrl)
                // var con=null
             // ImageResizer.createResizedImage(rowData.resourceUrl,150,150,"PNG", 80,0).then((response)=>{
             // return  convert=(
                 {/*<TouchableOpacity onPress={this.fets.bind(this,bigimage)}>*/}
                        {/*<Image source={{uri:response.uri}} style={styles.fenmians}/>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View>*/}
                        {/*/!*{this.fetimg.bind(this)}*!/*/}
                    {/*</View>*/}
             // )
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

            {convert}
            {/*{flatlist==1?rowData.type==undefined || rowData.type==0?<TouchableOpacity onPress={this.fets.bind(this,bigimage)}>*/}
                {/*<Image source={{uri:rowData.resourceUrl}} style={styles.fenmians}/>*/}
            {/*</TouchableOpacity>:<TouchableOpacity onPress={this.fenmina.bind(this,rowData)}>*/}
                {/*<Image source={{uri:rowData.coverUrl}} style={[styles.fenmianvideo]}>*/}
                    {/*<Image source={require('../../../img/pinglun/bofang.png')}/>*/}
                {/*</Image>*/}
            {/*</TouchableOpacity>: <TouchableOpacity onPress={this.fets.bind(this,bigimage)}>*/}
                {/*<Image source={{uri:rowData.resourceUrl}} style={styles.fenmian}/>*/}
            {/*</TouchableOpacity>}*/}
        </View>)
    }
    images(img){
        ImageResizer.createResizedImage(img,150,150,"PNG", 80,0).then((response)=>{
            // this.setState({
            //     imageth:response.uri
            // })
            // this.renderimg(response.uri)
            this.fetimg(response.uri)

        })
    }
    fetimg(img){
        return(<TouchableOpacity onPress={this.fets.bind(this,bigimage)}>
            <Image source={{uri:img}} style={styles.fenmians}/>
        </TouchableOpacity>)
    }
    fets(rowData){
        let items = [];
        rowData.map((item,index)=>{
            items.push({source:{uri:item.resourceUrl}})
            // 把需要的参数push进去

            // this.setState({
            //     //  你直接把item的值 给data就好了啊  不需要setState的
            // })
        })
        this.props.navigation.navigate('CeShiImage',{data:items})
    }
    fenmina(rowData){
        WatchVideo.playVideo(rowData.coverUrl,rowData.resourceUrl);
    }
    sheng(rowData,rowId){
        // alert(JSON.stringify(rowData.collectType))
        if(this.state.dataArray[rowId]){
            if(this.state.dataArray[rowId].userMember.id==this.state.tags){
                this.setState({
                    isShowModal:true,
                    rowId:rowId,
                    delectId:rowData.id
                })
            }else {
                this.setState({
                    isShowLong:true,
                    // rowId:rowId,
                    // delectId:rowData.id
                    shoucangId:rowData.id,
                    shourowId:rowId,
                    collectType:rowData.collectType,
                    followType:rowData.followType,
                    guanzhuuserid:rowData.userMember.id,

                })
            }
        }


     // alert(rowId)
    }
    dongtaidetail(id){
      this.props.navigation.navigate('DongTaiDetails',{data:id,id:0})
    }
    _onRefresh(){
        // alert(this.state.array.length)
        this.setState({
            isRefreshing:true,

        })
        // this.fetchData(1)
        setTimeout(()=>{
            this.setState({
                isRefreshing:false
            })
        },1000)
    }
    _fetchMoreData(){
        if(this.state.isFistLoad == true){

            this.setState({

                isFistLoad:false,
            })

            return;
        }
        // flags +=1 ;
        //
        // // alert(this.state.pageIndex)
        // if(flags>0){
        //
        //     this.fetchData(flags)
        //     // alert(flags)
        // }
        if(this.state.array.length==0){
            return
        }
        this.setState({
            pageIndex:this.state.pageIndex+1,
            isLoading:true

        })
        // alert(this.state.pageIndex)
      this.fetchData(this.state.pageIndex+1,this.state.friendid)

    }
    _renderfoot=()=>{

        if(this.state.array.length==0){
            return(<View style={styles.loadingMore}>
                <Text style={styles.loadingText}>没有更多数据啦...</Text>
            </View>)
        }else {
            return (<ActivityIndicator
                style={styles.loadingMore}
            />)
        }
    }
    dianzan(item,index) {
        let array = this.state.dataArray;
        // alert(JSON.stringify(array[index].id))
      if(array[index].id==item.id){

        if (array[index].suppoppType) {
            array[index]['suppoppType'] = 0;
            if (array[index].suppoppType == 0) {
                postFetch(API.QuXiaoZan,{forumPostSuppopp:{postId:array[index]['id']}},(result)=>{
                    if(result.status==1) {
                        // if(array[index].id==item.id){


                        array[index]['supports']=array[index]['supports']-1
                        // array[index]['suppoppType']=array[index]['suppoppType']+1
                        this.setState({

                            dataSources: this.state.dataSources.cloneWithRows(JSON.parse(JSON.stringify(array)))


                        })
                        // }
                    }

                })
            }
            mSelectWhat = -1
        } else {
            // array.map((o, i) => {
            //     if (i == index) {
                    array[index]['suppoppType'] = 1
                    mSelectWhat = index;
                    if (array[index]['suppoppType'] == 1) {
                        // this.setState({
                        //     isGreat:true,
                        //     // isSupport:array[i]['supports']+1
                        // })
                        postFetch(API.DianZan, {postId: array[index]['id']}, (result) => {
                            // JSON.stringify(result)
                            if (result.status == 1) {

                              array[index]['supports']=array[index]['supports']+1
                                // array[index]['suppoppType']=array[index]['suppoppType']-1
                                // array[i]['suppoppType'] = 1
                                this.setState({
                                    dataSources: this.state.dataSources.cloneWithRows(JSON.parse(JSON.stringify(array)))
                                })
                            }
                            // alert(JSON.stringify(array[index]['suppoppType']))
                        }, (error) => {

                        })
                    }
                // } else {
                //     array[i]['suppoppType'] = 0
                //     mSelectWhat = i;
                // }
            // })
        }
        }
    }

    _renderRow=(rowData)=>{
        // alert(JSON.stringify(rowData.resourceUrl))
        return(
            <View style={{width:Contants.Screen.width,height:40}}>
            <Image source={{uri:rowData.resourceUrl}} style={{width:40,height:40}}/>
            {/*<Text>ssss</Text>*/}
        </View>
        )
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
        // borderWidth:1,
        // borderColor:'gray',
         alignItems:'center',
        marginTop:10,
        marginBottom:10
    },
    chixu:{
      flexDirection:'column',
        justifyContent:'center',
        // alignItems:'center'
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
    loadingMore: {
        marginVertical: 20,
        flexDirection:'row',
        justifyContent:'center'
    },
    loadingText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    },
    border:{
        height:57,width:57,borderWidth:1,borderRadius:6,borderColor:'#E5E5E5',
        justifyContent:'center',alignItems:'center',
    },
    scrollist:{
        flexDirection:'column',alignItems:'center',marginTop:20,marginLeft:10,marginRight:10,marginBottom:20
    },
    scrollists:{

        flexDirection:'column',alignItems:'center',marginTop:0,marginLeft:8,marginRight:8
    },
    matop:{
        zIndex:100,position:'absolute',marginLeft:Contants.Screen.width-55,marginTop:30
    },
    topview:{
        height:137,
        width:241,
        flexDirection:'row',
        backgroundColor:'white',
        justifyContent:'space-around',
        marginTop:80,
        // marginLeft:120,
        borderRadius:4,
        alignSelf:'flex-end'

    },
    radiom:{
        flexDirection:'column',alignItems:'center',width:190,justifyContent:'space-around',
    },
    fsize:{
      fontSize:15,
        color:'#282828'
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
        width:100,height:100,marginTop:7,marginLeft:7,marginRight:10,borderRadius:4,

    },
    fenmians:{
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5,
        // resizeMethod:'contain'
    },
    fenmianvideo:{
        backgroundColor:'gray',
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5,
        justifyContent:'center',alignItems:'center',
    },
    shehui:{
      flexDirection:'row',
        // justifyContent:'center',
        height:43,
        alignItems:'center',
    },
    shui:{
      flexDirection:'column',
    },
    imgtext:{
      marginLeft:30,
    },
     context:{
         marginLeft:20,fontSize:12,color:'#282828'
     },
    pingluntext:{
        marginRight:20,
        fontSize:12,
        color:'#B2B2B2'
    },
    jian:{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0
    },
    yuanzhu:{
      flexDirection:'row',
        justifyContent:'flex-end',
        height:40
    },
    yuan:{
      color:'#B2B2B2',
        fontSize:14,
    }

})