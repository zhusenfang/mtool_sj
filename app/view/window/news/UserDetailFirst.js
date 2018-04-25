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
import Toast from "react-native-easy-toast";
var flatlist=''
import WatchVideo from '../../nativeModuals/WatchVideo'
import Storage from '../../../common/GGAsyncStorage'
// import FastImage from 'react-native-fast-image'
var bigimage=[]
export default class UserDetailFirst extends Component{
    constructor(props){
        super(props)
        this.state={
         picurl:null,
            name:'',
            age:'',
            sex:'',
            fensi:'',
            guanzhu:'',
            introduce:'',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            pageIndex: 0,
            dataArray:[],
            array:[],
            isLoading:false,
            isRefreshing:false,
            dataSourceimg: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isGuanZhu:'',
            tags:''
        }
    }
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
        Storage.get("userId").then((tagss)=>{

            this.setState({
                tags:tagss
            })
        })
    const per=this.props.navigation.state.params.numpage
    this.postfetch(1)
    }
    postfetch(page){
        // const list=this.props.navigation.state.params.data;
        // alert(JSON.stringify(list))
        postFetch(API.UserDetails,{pageNum:page,numPerPage:6,userMember:{id:this.props.navigation.state.params.data,hxUsername:this.props.navigation.state.params.hxid}},(result)=>{

            // alert(JSON.stringify(result.data.forumPostDo))
            if(result.status==1){
              this.setState({
                  picurl:result.data.userMemberDo.picUrl,
                  name:result.data.userMemberDo.nickname,
                  age:result.data.userMemberDo.age,
                  sex:result.data.userMemberDo.sex,
                  fensi:result.data.userMemberDo.fanscount,
                  guanzhu:result.data.userMemberDo.idolcount,
                  introduce:result.data.userMemberDo.introduction,
                  isGuanZhu:result.data.attentionFlag,


              })
                if(page==1){
                    this.setState({
                        array:result.data.forumPostDo,
                        // data:result.data
                        dataArray:result.data.forumPostDo,
                        dataSource:this.state.dataSource.cloneWithRows(result.data.forumPostDo)
                    })
                }else {
                    this.setState({
                        isLoading:true,
                        dataArray:this.state.dataArray.concat(result.data.forumPostDo),
                        dataSource:this.state.dataSource.cloneWithRows(this.state.dataArray.concat(result.data.forumPostDo)),
                        array:result.data.forumPostDo,
                    })

                }
            }
        },(error)=>{
            // alert(error)
        })
    }
    render(){
        return(<ScrollView style={[comstyle.con,{flexDirection:'column',}]}>
            <View style={sytles.zhao}>
              <View style={sytles.tou}>
                <Image source={{uri:this.state.picurl}} style={sytles.img}/>
                  <View style={sytles.lit}>
                    <Text style={sytles.name}>{this.state.name}</Text>
                      <View style={sytles.rws}>
                       <Image source={this.state.sex==0?require('../../../img/pinglun/girls.png'):require('../../../img/pinglun/man.png')}/>
                       <Text style={sytles.age}>{this.state.age}</Text>
                      </View>
                      <View style={sytles.rw}>
                          <Text style={sytles.guan}>{'关注：'+this.state.guanzhu}</Text>
                          <Text style={sytles.guan}>{' / 粉丝：'+this.state.fensi}</Text>
                      </View>
                  </View>
              </View>
                <Text style={sytles.intro}>{this.state.introduce}</Text>
            </View>
            <View style={comstyle.heng}/>
            <View style={sytles.guanzhu}>
                <View style={comstyle.item}>
                    <Text style={comstyle.maleft}>关注</Text>
                    <TouchableOpacity onPress={this.isGuanzhu.bind(this)}>
                    <Image source={this.state.isGuanZhu==0?require('../../../img/pinglun/guanzhu.png'):require('../../../img/pinglun/guanzhupress.png')} style={comstyle.textright}/>
                    </TouchableOpacity>
                </View>
                <View style={comstyle.heng}/>
                <TouchableOpacity style={comstyle.item} onPress={this.biaoqian.bind(this)}>
                    <Text style={comstyle.maleft}>设置标签</Text>
                    <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
                </TouchableOpacity>
                <View style={comstyle.heng}/>
                <TouchableOpacity style={comstyle.item} onPress={this.yonghushe.bind(this)}>
                    <Text style={comstyle.maleft}>用户设置</Text>
                    <Image source={require('../../../img/shezhi/jian.png')} style={comstyle.textright}/>
                </TouchableOpacity>
                <View style={comstyle.heng}/>
            </View>

            <View style={sytles.guanzhu}>
              <ListView
                  dataSource={this.state.dataSource}
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
            </View>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='top'
            />
        </ScrollView>)
    }
    biaoqian(){
        var comon=''
        // alert(this.props.navigation.state.params.hxid)
        const list=this.props.navigation.state.params.data;
        if(list===undefined){
            comon=this.props.navigation.state.params.hxid
        }else {
            comon=list
        }
        if(this.state.tags===comon){
            this._toast.show('您自己的动态不能设置标签')
            return
        }
        this.props.navigation.navigate('BiaoQianSetting',{data:comon})
    }
    yonghushe(){
        var comon=''
        // alert(this.props.navigation.state.params.hxid)
        const list=this.props.navigation.state.params.data;
        if(list===undefined){
            comon=this.props.navigation.state.params.hxid
        }else {
            comon=list
        }

       this.props.navigation.navigate('UserSetting',{data:comon})
    }
    isGuanzhu(){
        var comon=''
        // alert(this.props.navigation.state.params.hxid)
        const list=this.props.navigation.state.params.data;
        if(list===undefined){
            comon=this.props.navigation.state.params.hxid
        }else {
            comon=list
        }

        if(this.state.tags===comon){
            this._toast.show('您自己的动态不能关注')
            return
        }
        if(this.state.isGuanZhu==0){
            postFetch(API.GuanZhuUser,{idolId:comon},(result)=>{
                // alert(JSON.stringify(result))
                this.setState({
                    isGuanZhu:1
                })
                this._toast.show(result.msg)
            },(error)=>{
                alert(error)
            })
        }else {
            postFetch(API.QuXiaoGuanZhuUser,{idolId:comon},(result)=>{
                // alert(JSON.stringify(result))
                this.setState({
                    isGuanZhu:0
                })
                this._toast.show(result.msg)
            },(error)=>{
                alert(error)
            })
        }
    }
    renderItem(rowData,sectionID,rowID){
        flatlist=rowData.resourceIsNull==1?this.state.dataArray[rowID].forumThreadResources.length:null
        bigimage=rowData.resourceIsNull==1?this.state.dataArray[rowID].forumThreadResources:null
        return(
            <TouchableOpacity style={sytles.toux} onPress={this.dongtaidetail.bind(this,rowData.id)}>
                <View style={[sytles.item,{justifyContent:'space-between'}]}>
                    <View style={comstyle.rightview}>
                        <TouchableOpacity >
                            <Image source={{uri:rowData.userMember&&rowData.userMember.picUrl}} style={sytles.image}/>
                        </TouchableOpacity>
                        <View style={sytles.chixu}>
                            <Text style={{fontSize:12,color:'#282828'}}>{rowData.userMember&&rowData.userMember.nickname}</Text>
                            {/*<Text>{rowData.createTime}</Text>*/}
                            <Text style={{fontSize:10,color:'#B2B2B2'}}>{new Date(rowData.createTime).getHours()+'小时前'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{height:40,width:40,alignItems:'center',justifyContent:'center',}}>
                        <Image source={require('../../../img/pinglun/shenglh.png')} style={{marginRight:20}}/>
                    </TouchableOpacity>
                </View>

                <View style={{width:335,height:1,backgroundColor:'#E5E5E5',alignSelf:'center',marginBottom:10}}/>
                <View style={{flexDirection:'column',alignItems:'center'}}>

                    {rowData.resourceIsNull==1? <View style={sytles.tupian}>
                        <ListView
                            dataSource={this.state.dataSourceimg.cloneWithRows(rowData.forumThreadResources)}
                            renderRow={this.renderimg}
                            removeClippedSubviews={false}
                            // horizontal={true}
                            contentContainerStyle={sytles.consty}
                            enableEmptySections={true}
                            style={{backgroundColor:'white',marginLeft:7}}
                        />
                    </View>:null}
                    <View style={sytles.item}>

                        <View style={sytles.you}>
                            <View style={sytles.kai}>
                                <Text style={sytles.context} numberOfLines={2}>{rowData.content}</Text>
                            </View>
                            <View style={sytles.kais}>
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('DongTaiDetails',{data:rowData.id,id:1})}}>
                                    <Image source={require('../../../img/pinglun/pinglun.png')}/>
                                </TouchableOpacity>
                                <Text style={{marginRight:20}}>{rowData.opposes}</Text>
                                <TouchableOpacity onPress={this.dianzan.bind(this,rowData,rowID)}>
                                    <Image source={rowData.suppoppType==0?require('../../../img/pinglun/dianzan.png'):require('../../../img/pinglun/dianzanpress.png')}/>
                                </TouchableOpacity>
                                <Text style={{marginRight:20}}>{rowData.supports}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
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
                    postFetch(API.DianZan, {postId: array[index]['id']}, (result) => {
                        // JSON.stringify(result)
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
    renderimg=(rowData,sectionID,rowID)=>{
        var convert=null
        if(flatlist==1){

            if(rowData.type==undefined || rowData.type==0){
                // alert(JSON.stringify(rowData.resourceUrl))
                convert=(<TouchableOpacity onPress={this.fets.bind(this,bigimage)}>
                    <Image source={{uri:rowData.resourceUrl}} style={sytles.fenmian}/>
                    {/*<FastImage*/}
                        {/*style={sytles.fenmians}*/}
                        {/*source={{uri:rowData.resourceUrl,*/}
                        {/*headers:{ Authorization: 'someAuthToken' },*/}
                        {/*priority: FastImage.priority.normal,*/}
                    {/*}}*/}
                    {/*resizeMode={FastImage.resizeMode.contain}*/}
                    {/*/>*/}
                    {/*<WebImage style={sytles.fenmians} source={{uri: rowData.resourceUrl}} />*/}
                </TouchableOpacity>)
            }else {
                // alert(rowData.coverUrl)
                convert=(<TouchableOpacity onPress={this.fenmina.bind(this,rowData)}>
                    <Image source={{uri:rowData.coverUrl}} style={[sytles.fenmianvideo]}>
                        <Image source={require('../../../img/pinglun/bofang.png')}/>
                    </Image>
                </TouchableOpacity>)
            }
        }else {
            convert=( <TouchableOpacity onPress={this.fets.bind(this,bigimage)}>
                <Image source={{uri:rowData.resourceUrl}} style={sytles.fenmian}/>
                {/*<FastImage*/}
                    {/*style={sytles.fenmian}*/}
                    {/*source={{uri:rowData.resourceUrl,*/}
                        {/*headers:{ Authorization: 'someAuthToken' },*/}
                        {/*priority: FastImage.priority.normal,*/}
                    {/*}}*/}
                    {/*resizeMode={FastImage.resizeMode.contain}*/}
                {/*/>*/}
                {/*<WebImage style={sytles.fenmian} source={{uri: rowData.resourceUrl}} />*/}
            </TouchableOpacity>)
        }
        return(<View style={{flexDirection:'row',flexWrap:'wrap'}} key={rowID}>
            {convert}
        </View>)
    }
    fenmina(rowData){
        WatchVideo.playVideo(rowData.coverUrl,rowData.resourceUrl);
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
    dongtaidetail(id){
        this.props.navigation.navigate('DongTaiDetails',{data:id,id:0})
    }
    _fetchMoreData(){
        if(this.state.isFistLoad == true){

            this.setState({

                isFistLoad:false,
            })

            return;
        }
        if(this.state.array.length==0){
            return
        }
        this.setState({
            pageIndex:this.state.pageIndex+1,
            isLoading:true

        })
        // alert(this.state.pageIndex)
        this.postfetch(this.state.pageIndex+1,1)

    }
    _renderfoot=()=>{

        if(this.state.array.length==0){
            return(<View style={sytles.loadingMore}>
                <Text style={sytles.loadingText}>没有更多数据啦...</Text>
            </View>)
        }else {
            return (<ActivityIndicator
                style={sytles.loadingMore}
            />)
        }
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
}
const sytles=StyleSheet.create({
   zhao:{
       flexDirection:'column',
       marginTop:15.5,
       height:100,
       // alignItems:'center',
       backgroundColor:'white',
       justifyContent:'center',

   },
    tou:{
       flexDirection:'row',
    },
    lit:{
       flexDirection:'column',
        marginLeft:10
    },
    img:{
       marginLeft:20,
        // marginTop:10,
        width:60,
        height:60,
        borderRadius:4
    },
    rw:{
       flexDirection:'row',
        // justifyContent:'center',
    },
    rws:{
        flexDirection:'row',
        height:20,
        justifyContent:'flex-start',
        alignItems:'center',
        // justifyContent:'center',
    },
    name:{
       fontSize:14,
        color:'#282828'
    },
    age:{
       fontSize:10,
        color:'#B2B2B2',
        marginLeft:5
    },
    guan:{
        fontSize:10,
        color:'#B2B2B2',
    },
    intro:{
       fontSize:10,
        color:'#4D4D4D',
        marginLeft:20,
        marginTop:10
    },
    guanzhu:{
       flexDirection:'column',
        backgroundColor:'white',
        marginTop:15.5
    },
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
        width:100,height:100,marginTop:7,marginLeft:7,marginRight:10,borderRadius:4
    },
    fenmians:{
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5
    },
    fenmianvideo:{
        backgroundColor:'gray',
        width:Contants.Screen.width-20,height:120,marginTop:7,marginLeft:5,borderRadius:5,
        justifyContent:'center',alignItems:'center',
    },
    context:{
        marginLeft:20,fontSize:12,color:'#282828'
    },
})
