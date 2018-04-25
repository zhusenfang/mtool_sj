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
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants'
import Toast from 'react-native-easy-toast'
import Login from "../../Login";
import Modal from 'react-native-modal';
var mSelectWhat = -1;
export default class DongTaiPing extends Component{
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            dataSourcetr: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            textinput:'',
            pingluName:'',
            pingluId:"",
            isShowPing:false,
            fathId:'',
            dataArray:[],
            id:'',
            fenxiang:false
        }
    }
    componentWillMount(){
        const list = this.props.navigation.state.params.data;
        postFetch(API.JingXuanPL,{postId:list},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    dataSourcetr:this.state.dataSourcetr.cloneWithRows(result.data)
                })
            }
        })
    }
    componentWillUnmount(){
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }

    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    componentDidMount() {
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        const id=this.props.navigation.state.params.id;
        // alert(id)
        if(id==1){
            setTimeout(()=>{
                this.setState({
                    isShowPing:true
                })
            },500)

        }
        this.fetchData()
    }
    fetchData(){
        const list = this.props.navigation.state.params.data;
        postFetch(API.DongTaiPingLund,{forumPostComment:{id:list}},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data),
                    dataArray:result.data
                })
            }
        },(error)=>{
            this._toast.show(error)
        })
    }
    render(){

        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>

            <Text style={pinstyle.pinl}>精选评论</Text>
            <ListView
                dataSource={this.state.dataSourcetr}
                renderRow={this._renderRowImage}
                // style={{height:80}}
                enableEmptySections={true}
            />
            <Text style={pinstyle.pinl}>评论</Text>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRowImage}
                // style={{height:100}}
                enableEmptySections={true}
            >
                {/*,paddingHorizontal:30,paddingTop:20*/}
            </ListView>
            <Modal
                isVisible={this.state.isShowPing}
                hideOnBack={true}
                transparent={true}
                style={{justifyContent:'flex-end',margin:0}}
                backdropColor='transparent'
                // backdropOpacity={0.3}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowPing: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                {/*<KeyboardAvoidingView behavior="padding" style={{flex:1,justifyContent:'center'}}>*/}
                {/*<View style={{flex:1}}/>*/}
                <View style={{justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                    <TextInput
                        style={{   backgroundColor: "#FFFFFF",
                            // textAlign: "center",
                            height:70,
                            borderWidth:1,
                            borderColor:'#E5E5E5',
                            width:Contants.Screen.width-80,
                            // marginLeft:10,
                            borderRadius:4,
                            margin:0,}}
                        ref={(e)=>this._deviceIdInput=e}
                        value={this.state.textinput}
                        placeholder={this.state.pingluName==''?'发表新评论...':this.state.pingluName}
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#B2B2B2"
                        autoFocus={this.state.isShowPing}
                        // defaultValue={this.state.pingluName}
                        onChangeText={(e)=>{
                            this.setState({
                                textinput:e,
                            })
                        }}
                    />
                    {/*<View style={{flex:1,height:30}}/>*/}

                    {/*<View style={{flex:1}}></View>*/}
                    <View style={[pinstyle.tups]}>
                        <TouchableOpacity style={pinstyle.items} onPress={this.tongbu.bind(this)}>
                            {/*<Image source={require('../../../img/pinglun/ait.png')} style={pinstyle.imgm}/>*/}
                            <Image source={this.state.fenxiang==false?require('../../../img/pinglun/fenxiangs.png'):require('../../../img/pinglun/fenxiangspress.png')} style={pinstyle.imgm}/>
                            {/*<Image source={require('../../../img/pinglun/shoucang.png')} style={pinstyle.imgm}/>*/}
                        </TouchableOpacity>
                        <View style={{flex:1}}/>
                        <TouchableOpacity onPress={this.fasong.bind(this)}>
                            <Image source={require('../../../img/pinglun/fasong.png')} style={pinstyle.time}>
                                <Text style={pinstyle.song}>发送</Text>
                            </Image>
                        </TouchableOpacity>
                    </View>

                </View>
                {/*</KeyboardAvoidingView>*/}

            </Modal>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
        </View>)

    }
    tongbu(){
      this.setState({
          fenxiang:true
      })
    }
    fasong(){
        // alert(JSON.stringify(this.state.fathId))
        const list = this.props.navigation.state.params.data;
        if(this.state.textinput===''){
            this._toast.show('请输入评论')
            return
        }
        // if(this.state.fathId==''){
        //
        // }
        postFetch(API.ReportPingLun,{postId:list,content:this.state.textinput,parentId:this.state.pingluId,fatherId:this.state.fathId,shareType:this.state.fenxiang==false?0:1},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this._toast.show(result.msg)
                this.fetchData()
                // this.refs._deviceIdInput.clear();
                this.setState({
                    textinput:'',
                    isShowPing:false
                })
            }
        },(error)=>{
            this._toast.show(error)
        })
        if(this.state.fathId==undefined){
            postFetch(API.ReportPingLun,{postId:list,content:this.state.textinput,parentId:this.state.pingluId,fatherId:this.state.id,shareType:this.state.fenxiang==false?0:1},(result)=>{
                if(result.status==1){
                    this._toast.show(result.msg)
                    this.fetchData()
                    // this.refs._deviceIdInput.clear();
                    this.setState({
                        textinput:'',
                        isShowPing:false
                    })
                }
            })
            return
        }
    }
    _renderRowImage=(rowData,sectionID,rowID)=>{
        // alert(JSON.stringify(rowData.opposes))
        return(<View style={{height:100,backgroundColor:'white'}}>
            <View style={pinstyle.dongta}>
                <View style={comstyle.rightview}>
                    <Image source={{uri:rowData.userMember.picUrl}} style={[comstyle.maleft,{width:35,height:35,borderRadius:4}]}/>
                    <View style={pinstyle.ma}>
                        <Text>{rowData.userMember.nickname}</Text>
                        <Text>{new Date(rowData.createTime).getHours()+'小时前'}</Text>
                    </View>
                </View>
                <View style={comstyle.time}>
                    <TouchableOpacity onPress={this.pinglun.bind(this,rowData)} style={pinstyle.show}>
                        <Image source={require('../../../img/pinglun/pinglun.png')}/>
                        <Text style={comstyle.textright}>{rowData.opposes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.dianzan.bind(this,rowData,rowID)} style={pinstyle.show}>
                        <Image source={rowData.suppoppType==0?require('../../../img/pinglun/dianzan.png'):require('../../../img/pinglun/dianzanpress.png')}/>
                        <Text style={comstyle.textright}>{rowData.supports}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={comstyle.heng}></View>
            <View style={pinstyle.show}>
                <Text style={comstyle.maleft}>{'回复'}</Text>
                <Text style={pinstyle.textColor}>{rowData.userMemberReply&&"@"}</Text>
                <Text style={pinstyle.textColor}>{rowData.userMemberReply&&rowData.userMemberReply.nickname}</Text>
                <Text>{':'+rowData.content}</Text>
            </View>
        </View>)
    }
    dianzan(item,index){
        let array = this.state.dataArray;
        const list = this.props.navigation.state.params.data;
        if(array[index].id==item.id){
            if (array[index].suppoppType) {
                array[index]['suppoppType'] = 0;
                if (array[index].suppoppType == 0) {
                    postFetch(API.QuXiaoZan,{forumPostSuppopp:{postId:list,commentId:array[index]['id']}},(result)=>{
                        // alert(JSON.stringify(result))
                        if(result.status==1) {
                            // if(array[index].id==item.id){


                            array[index]['supports']=array[index]['supports']-1
                            // array[index]['suppoppType']=array[index]['suppoppType']+1
                            this.setState({

                                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(array)))
                            })
                        }
                    })
                }
                mSelectWhat = -1
            } else {
                array[index]['suppoppType'] = 1
                mSelectWhat = index;
                if (array[index]['suppoppType'] == 1) {
                    postFetch(API.DianZan, {postId:list,commentId:array[index]['id']}, (result) => {
                        // alert(JSON.stringify(result))
                        if (result.status == 1) {

                            array[index]['supports']=array[index]['supports']+1
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(array)))
                            })
                        }
                    }, (error) => {

                    })
                }
            }
        }

    }
    pinglun(rowData){

        this.setState({
                pingluName: rowData.userMember.nickname+':',
                pingluId:rowData.memId,
                isShowPing:true,
                fathId:rowData.fatherId,
                 id:rowData.id,
            },
            //     ()=>{
            //     setTimeout(()=>{
            //         this.setState({
            //             isShowPing:true
            //         })
            //     },500)
            // }
        )
        // this.refs._deviceIdInput.focus()
    }
}
const pinstyle=StyleSheet.create({
    pinl:{
        marginTop:30,
        marginLeft:20,
        marginBottom:20,
        fontSize:14,
        color:'#282828',

    },
    item:{
        flexDirection:'row',
        backgroundColor:'white',
        height:50,
        alignItems:'center',
        justifyContent:'space-between'
    },
    wu:{
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    text:{
        marginRight:20
    },
    hui:{
        flexDirection:'row',
        height:30,
        alignItems:'center',
    },
    dongta:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:10,
        marginBottom:10
    },
    ma:{
        flexDirection:'column',
        alignItems:'center',
        marginLeft:10
    },
    show:{
        flexDirection:'row',
        marginTop:10
    },
    tups:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        // marginTop:300,
        // position:'relative'
        // position:'absolute',
        // paddingTop:"100%"
    },
    items:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        // marginTop:20
    },
    imgm:{
        margin:10
    },
    song:{
        fontSize:12,
        color:'white',
        // alignSelf:'center',
        //  marginRight:20
    },
    time:{
        marginRight:20,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
        // marginTop:20,
        marginBottom:10
    },
    textColor:{
        color:'#459CF4'
    }
})