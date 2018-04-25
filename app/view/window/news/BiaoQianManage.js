import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    ListView,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TextInput,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Contants from '../../../common/Contants'
import TabBar from '../../../common/DfyTabBar'
import DongTaiFirst from './DongTaiFirst'
import DongTaiPing from './DongTaiPing'
import CommonModal from '../../CommonPage/ComonModal'
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import CheckBox from '../../../common/CheckView'
var mSelectWhat = -1;
export default class BiaoQianManage extends Component{
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isList:false,
            isShowModal:false,
            shortTextinput:'',
            isModals:false,
            isBianjiName:false,
            listAllid:'',
            xuanze:'',
            data:'',
            dataSources: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
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
       this.posturl()
    }
    posturl(){
        postFetch(API.BiaoQianGuanli,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.data==[] || result.data.length==0){
                this.setState({
                    isList:true
                })
            }else {
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data),
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
        },(error)=>{
            alert(error)
        })
    }

    render(){
        return(<ScrollView style={[comstyle.con,{backgroundColor:'#f9f9f9',zIndex:100,flexDirection:'column'}]}>
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
                            <Text style={{marginLeft:20}}>删除标签</Text>
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
            <View  style={styles.headerContainer}>
                {/*内容*/}
                <Text allowFontScaling={false} style={styles.middleTitle}>
                    标签管理
                </Text>

                {/*左边返回按钮*/}
                <TouchableOpacity style={styles.leftImgBtn} onPress={() => {

                    this.props.navigation.goBack();

                }}>
                    <Image source={require("../../../img/page/arrow.png")}/>
                </TouchableOpacity>


                {/*<View style={styles.leftImgBtn}/>*/}

            </View>

           <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderItem}
          enableEmptySections={true}
          style={styles.list}
          />
            <View style={[comstyle.item]}>
              <Text style={[comstyle.maleft,styles.texts]}>{this.state.data==''?'添加新标签':this.state.data}</Text>
                <TouchableOpacity onPress={this.modals.bind(this)}>
                <Image source={this.state.data==''?require('../../../img/window/write.png'):require('../../../img/window/press.png')} style={comstyle.textright}/>
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={this.state.isShowModal}
                hideOnBack={true}
                transparent={true}
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={()=> {
                        this.setState({isShowModal: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                    <Text style={{margin:10,fontSize:14,color:'#282828'}}>添加新标签</Text>
                    <View style={comstyle.heng}/>
                    <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                        <TextInput
                            style={styles.textinput}
                            placeholder={'输入标签名称'}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#B2B2B2"
                            onChangeText={(e)=>{
                                this.setState({
                                    shortTextinput:e,
                                })
                            }}
                        />
                    </View>
                    <View style={comstyle.heng}/>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isShowModal:false
                            })
                        }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text onPress={()=>{this.setState({isShowModal:false})}} style={styles.texts}>返回</Text>
                        </TouchableOpacity>
                        <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                        <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={this.gengai.bind(this)} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                            <Text onPress={this.gengai.bind(this)} style={styles.texts}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
                <Modal
                    isVisible={this.state.isBianjiName}
                    hideOnBack={true}
                    transparent={true}
                    // style={styles.modalstyle}
                    //backdropColor='transferent'
                    backdropOpacity={0.3}
                >
                    {/*点击外框，键盘消失*/}
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({isBianjiName: false});

                        }}
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
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
                                    this.props.navigation.navigate('BianJiName',{data:this.state.listAllid,callbackimg:(data)=>{this.posturl()},callback:(data)=>{this.setState({data:data})}})

                                }else {
                                    if(this.state.xuanze==1){
                                        this.setState({
                                            isBianjiName:false
                                        })
                                        postFetch(API.DelectBiaoQian,{id:this.state.listAllid},(result)=>{
                                            // alert(JSON.stringify(result))
                                            if(result.status==1){
                                                // this.postFetchs();
                                                this.posturl()
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
                <Toast ref={(e) => {
                    this._toastqu = e
                }}
                       position='center'
                />

        </ScrollView>)
    }
    bianji(){

      this.setState({

          isModals:false,
          xuanze:2,
          isBianjiName:true,
      })

    }
    delectclassify(){
        this.setState({
            isBianjiName:true,
            isModals:false,
            xuanze:1
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
    modals(){
        if(this.state.data===''){
            this.setState({
                isShowModal:true
            })
        }else {
           postFetch(API.BianJIBiaoQianName,{id:this.state.listAllid,name:this.state.data},(result)=>{
              // alert(JSON.stringify(result))
               if(result.status==1){
                  this._toastqu.show(result.msg)
                   this.posturl()
               }
           },(error)=>{
               this._toastqu.show(error)
           })
        }

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
    // _change(info){
    //     // alert(JSON.stringify(this.state.imgurls))
    //
    //     var dou=false
    //     for (var i = 0; i < this.state.list.length; i++) {
    //         if (this.state.list[i] == info) {
    //             dou=true
    //         }
    //     }
    //     if(!dou){
    //         this.state.list.push(info)
    //     }else {
    //         for (var i = 0; i < this.state.list.length; i++) {
    //             if (this.state.list[i] == info) {
    //                 this.state.list.splice(i,1)
    //             }
    //         }
    //     }
    //
    // }
    gengai(){
     postFetch(API.TianJIaBiaoQian,{name:this.state.shortTextinput},(result)=>{
         if(result.status==1){
             this._toastqu.show(result.msg)
             this.setState({
                 isShowModal:false
             })
             this.posturl()
         }
     })
    }
    renderItem=(rowData)=>{
        return(<TouchableOpacity style={styles.fle} onPress={()=>{this.props.navigation.navigate('BianJiBiaoQian',{data:rowData.id})}}>
            <View style={[comstyle.item,{marginTop:0}]}>
                <Text style={[comstyle.maleft,styles.texts]}>{rowData.name}</Text>
                {/*<CheckBox onChange={this._change.bind(this,rowData.id)} style={{marginRight:20}}/>*/}
                <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
            </View>
            <View style={comstyle.heng}/>
        </TouchableOpacity>)
    }
    _change(){

    }
}
const styles=StyleSheet.create({
    fle:{
        flexDirection:'column',

    },
    list:{
     width:Contants.Screen.width,
        marginTop:20,
        // height:600
    },
    texts:{
        fontSize:14,color:'#282828'
    },
    textinput:{
        backgroundColor: "#FFFFFF",
        // textAlign: "center",
        height:40,
        borderWidth:1,
        borderColor:'#E5E5E5',
        width:Contants.Screen.width-80,
        // marginLeft:10,
        marginRight:40,
    },
    //导航栏样式
    headerContainer: {
        height: 60,
        backgroundColor: "white",
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
})