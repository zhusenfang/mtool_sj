import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Button,
    ListView,
    ScrollView,
    Platform,
    Switch,
    AsyncStorage,
    FlatList,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
import Storage from '../../../common/GGAsyncStorage'
import MyTimer from '../../../common/MyTimer'
import dismissKeyboard from 'dismissKeyboard'
var TimerMixin=require('react-timer-mixin');

var pagelist=[]
export default class SearchOrder extends Component {
    mixins:[TimerMixin]
    constructor(props){
        super(props);
        // this.shit().bind(this)
        this.state={
            text:'',
            isStyle:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            dataSourceimg: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),

            hisList:[],
            datas:0,
            list:[],
            hashlist:[]
        }

    }
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
    }

    // componentWillUnmount(){
    //
    // }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    componentWillMount(){
        postFetch(API.SearchHot,{type:0},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    // hotList:result.data,
                    dataSourceimg:this.state.dataSourceimg.cloneWithRows(result.data)
                })
            }
        })

        // this.timer = setInterval(()=>{
        //
        //     this.setState({
        //         datas:this.state.datas-1
        //     })
        //     // alert(this.state.datas)
        //
        // },1000)

    }
  // componentDidMount(){
      // this.timer = setInterval(()=>{
      //
      //     this.setState({
      //         datas:this.state.datas-1
      //     })
      //     // alert(this.state.datas)
      //
      // },1000)
  // }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }
    render(){

        var contview=null;
        if(this.state.isStyle==false){
            contview=(<View><View style={styles.his}>
                    <View style={comstyle.rightview}>
                        <Text style={styles.histext}>历史搜索</Text>
                    </View>
                    <View style={comstyle.leftview}>
                        <TouchableOpacity onPress={this.laji.bind(this)}>
                            <Image source={require('../../../img/window/lajitong.png')} style={styles.maleft}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('SearchOrderHistory')}}>
                            <Image source={require('../../../img/search/shenglh.png')} style={comstyle.textright}/>
                        </TouchableOpacity>
                    </View>
                </View>
                    <View style={[comstyle.heng,{marginTop:15,flexDirection:'row',}]}/>

                    <View>
                        {/*{pagelist}*/}
                        <Heading/>
                        {/*<ListView*/}
                        {/*dataSource={this.state.dataSourceimg.cloneWithRows(this)}*/}
                        {/*renderRow={this._renderImag}*/}
                        {/*/>*/}
                    </View>
                    <View style={styles.his}>
                        <Text style={styles.histext}>热门搜索</Text>

                    </View>
                    <View style={[comstyle.heng,{marginTop:15,flexDirection:'row',}]}/>
                    {/*<View style={{flexDirection:"row",flexWrap:'wrap',marginLeft:10,marginRight:10}}>*/}
                        {/*{hotlist}*/}
                    {/*</View>*/}
                    <ListView
                    dataSource={this.state.dataSourceimg}
                    renderRow={this._renderHot}
                    contentContainerStyle={styles.consty}
                    />
                </View>
            )
        }else {
            contview=(
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    pagingEnabled={true}
                    horizontal={false}
                    onScroll={(e)=>{
                    }}
                >
                    {this.state.list.map((rowData,index)=>{
                        rowData.countdownTime-=1000
                        return(<TouchableOpacity style={styles.toux} onPress={this.shit.bind(this,rowData)} key={index}>
                            {rowData.diningType==2 ?
                                <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                    <View style={{flexDirection:'column'}}>
                                        <Image source={require('../../../img/tools/daisong.png')} style={comstyle.maleft} />
                                    </View>
                                    <View style={styles.item}>
                                        <Text>{rowData.merchantRestaurants&&rowData.merchantRestaurants.address}</Text>
                                    </View>
                                </View>:<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} >
                                    <View style={{flexDirection:'column'}}>
                                        <Image source={require('../../../img/order/lanshutiao.png')} />
                                    </View>
                                    <Image source={{uri:rowData.imlUrl}} style={{width:45,height:45,marginLeft:20}} />
                                    <View style={styles.item}>
                                        {/*<Text>{rowData.consignee}</Text>*/}
                                        <Text style={{fontSize:14,color:'#282828',marginBottom:2.5}}>{rowData.orderName}</Text>
                                        <Text style={{fontSize:10,color:'#B2B2B2',marginTop:2.5}} >{rowData.deliveryType==0?'外送：立即配送':'到店'}</Text>
                                    </View>
                                </View>
                            }
                            {rowData.status==0||rowData.status==1||rowData.status==2?<View style={{flexDirection:'row',justifyContent:"flex-end"}} >
                                    <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',}}>
                                        {/*<View style={{flex:1}}/>*/}
                                        <Image source={rowData.diningType==0||rowData.diningType==2?require('../../../img/order/bluequan.png'):require('../../../img/order/greenquan.png')}
                                               style={{marginRight:20,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'}} >
                                            <Text style={{color:rowData.diningType==0||rowData.diningType==2?'#459CF4':'#33BAB2',fontSize:10}} >{rowData.orderNumber==undefined?'0号':rowData.orderNumber+'号'}</Text>
                                        </Image>
                                        <Text style={{marginRight:20,fontSize:10,color:'#FF305E'}} >{

                                            rowData.status==0? MyTimer.formatSeconds(2,rowData.countdownTime/1000):
                                                rowData.countdownTime<0?MyTimer.formatSeconds(2,-(rowData.countdownTime/1000)):MyTimer.formatSeconds(2,rowData.countdownTime/1000)
                                        }</Text>
                                    </View>
                                    {/*<Text onPress={this.jiedan.bind(this,rowData.id)}>{rowData.id}</Text>*/}
                                    {/*<Text>{this.state.ids}</Text>*/}
                                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',}} >
                                        <Image source={require('../../../img/window/press.png')} style={{marginRight:20}} />
                                    </View>
                                </View>:
                                <View style={styles.timeview} >
                                    <Text style={styles.apptime} >{new Date(rowData.createTime).getFullYear()+'-'}</Text>
                                    <Text style={styles.apptime}>{new Date(rowData.createTime).getMonth()+1+'-'}</Text>
                                    <Text style={styles.apptime} >{new Date(rowData.createTime).getDate()}</Text>
                                </View>
                            }

                        </TouchableOpacity>)
                    })}

                </ScrollView>
            )
        }

        return(<View style={styles.con}>
            <View style={styles.textinput}>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.inputsty}
                    placeholderTextColor="#B2B2B2"
                    onChangeText={(e)=>{
                        this.setState({
                            text:e,
                        })
                    }}
                    multiline={true}
                    placeholder={'输入信息'}
                    onFocus={()=>{this.setState({isStyle:true})}}
                >

                </TextInput>
                <TouchableOpacity onPress={this.searchdong.bind(this)}>
                    <Image source={require('../../../img/page/srarch.png')} style={styles.img}/>
                </TouchableOpacity>
            </View>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
            {/*<TouchableOpacity onPress={this.searchdong.bind(this)} style={styles.img}>*/}

            {/*</TouchableOpacity>*/}
            {contview}

        </View>)
    }
    // componentWillReceiveProps(){
    //     alert(JSON.stringify(this.state.hashlist))
    // }
    _renderHot=(rowData)=>{
     return(<View style={styles.key}>
         <View style={styles.bord}><Text style={styles.keyword}>{rowData.keyword}</Text></View>
     </View>)
    }
    laji(){
        Storage.delete('searchorder').then((tags)=>{
            this.setState({
                hisList:''
            })
        })
        pagelist.splice(0,pagelist.length)
    }
    searchdong(){
        this.timer && clearInterval(this.timer);
        dismissKeyboard();
       if(this.state.text==""){
       this._toast.show('请输入关键字')
           return
       }
        var hist=[this.state.text]
        // var tags=new Array();
        // tags.push(hist)
        // // alert(tags)
        // Storage.save('sear',tags)
        Storage.get('searchorder').then((taggs)=>{
            if(taggs==null){
                taggs = new Array();
            }
            taggs.push(hist)
            AsyncStorage.setItem('searchorder', JSON.stringify(taggs),);
        })
        // alert(this.state.text)
        // this.setState({
        //     hashlist:hist
        // })
        postFetch(API.SearchOrder,{keyWord:this.state.text},(result)=>{
            // alert(JSON.stringify(result))
            // alert(JSON.stringify(this.props))
            if(result.status==1){
                if(result.data==[] || result.data.length==0) {
                  this._toast.show('搜索无结果')
                    return
                }
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(result.data),
                    list:result.data,
                })
                this.timer = setInterval(()=>{

                    this.setState({
                        datas:this.state.datas-1
                    })
                    // alert(this.state.datas)

                },1000)
            }
        },(error)=>{

        })
    }
    // _renderImag=(rowdata)=>{
    //     return(<View style={styles.pagelist}>
    //         <View style={styles.bord} ><Text style={styles.keyword}>{rowdata}</Text></View>
    //     </View>)
    // }e

    _renderRow=(rowData,sectionID,rowID)=>{
        // rowData.item.countdownTime-=1000
        // return(<TouchableOpacity style={styles.toux} onPress={this.shit.bind(this,rowData.item)} key={rowID}>
        //     {rowData.item.diningType==2 ?
        //         <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} key={rowID}>
        //             <View style={{flexDirection:'column'}} key={rowID}>
        //                 <Image source={require('../../../img/tools/daisong.png')} style={comstyle.maleft} key={rowID}/>
        //             </View>
        //             <View style={styles.item} key={rowID}>
        //                 <Text key={rowID}>{rowData.item.merchantRestaurants&&rowData.item.merchantRestaurants.address}</Text>
        //             </View>
        //         </View>:<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} key={rowID}>
        //             <View style={{flexDirection:'column'}} key={rowID}>
        //                 <Image source={require('../../../img/order/lanshutiao.png')} key={rowID}/>
        //             </View>
        //             <Image source={{uri:rowData.item.imlUrl}} style={{width:45,height:45,marginLeft:20}} key={rowID}/>
        //             <View style={styles.item} key={rowID}>
        //                 {/*<Text>{rowData.consignee}</Text>*/}
        //                 <Text style={{fontSize:14,color:'#282828',marginBottom:2.5}} key={rowID}>{rowData.item.orderName}</Text>
        //                 <Text style={{fontSize:10,color:'#B2B2B2',marginTop:2.5}} key={rowID}>{rowData.item.deliveryType==0?'外送：立即配送':'到店'}</Text>
        //             </View>
        //         </View>
        //     }
        //     {rowData.item.status==0||rowData.item.status==1||rowData.item.status==2?<View style={{flexDirection:'row',justifyContent:"flex-end"}} key={rowID}>
        //             <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',}} key={rowID}>
        //                 {/*<View style={{flex:1}}/>*/}
        //                 <Image source={rowData.item.diningType==0||rowData.item.diningType==2?require('../../../img/order/bluequan.png'):require('../../../img/order/greenquan.png')}
        //                        style={{marginRight:20,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'}} key={rowID}>
        //                     <Text style={{color:rowData.item.diningType==0||rowData.item.diningType==2?'#459CF4':'#33BAB2',fontSize:10}} key={rowID}>{rowData.item.orderNumber==undefined?'0号':rowData.item.orderNumber+'号'}</Text>
        //                 </Image>
        //                 <Text style={{marginRight:20,fontSize:10,color:'#FF305E'}} key={rowID}>{
        //
        //                    rowData.item.status==0? MyTimer.formatSeconds(2,rowData.item.countdownTime/1000):
        //                        rowData.item.countdownTime<0?MyTimer.formatSeconds(2,-(rowData.item.countdownTime/1000)):MyTimer.formatSeconds(2,rowData.item.countdownTime/1000)
        //                 }</Text>
        //             </View>
        //             {/*<Text onPress={this.jiedan.bind(this,rowData.id)}>{rowData.id}</Text>*/}
        //             {/*<Text>{this.state.ids}</Text>*/}
        //             <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',}} key={rowID}>
        //                 <Image source={require('../../../img/window/press.png')} style={{marginRight:20}} key={rowID}/>
        //             </View>
        //         </View>:
        //         <View style={styles.timeview} key={rowID}>
        //             <Text style={styles.apptime} key={rowID}>{new Date(rowData.item.createTime).getFullYear()+'-'}</Text>
        //             <Text style={styles.apptime} key={rowID}>{new Date(rowData.item.createTime).getMonth()+1+'-'}</Text>
        //             <Text style={styles.apptime} key={rowID}>{new Date(rowData.item.createTime).getDate()}</Text>
        //         </View>
        //     }
        //
        // </TouchableOpacity>)
    }
    shit(rowdata){
        // alert(JSON.stringify(rowdata))
        // this.props.navigation.navigate('DongTaiDetails',{data:id})
        if(rowdata.status==0&&rowdata.diningType==0){
            this.props.navigation.navigate('OrderDetails',{data:JSON.stringify(rowdata.id)})
            return
        }
        if(rowdata.status==0&&rowdata.diningType==1){
            this.props.navigation.navigate('DaoOrderDetail',{data:JSON.stringify(rowdata.id)})
            return
        }
        if(rowdata.status==1||rowdata.status==2&&rowdata.diningType==0){
            this.props.navigation.navigate('DaoOrderDetail',{data:JSON.stringify(rowdata.id)})
            return
        }
        if(rowdata.status==1||rowdata.status==2&&rowdata.diningType==1){
            this.props.navigation.navigate('DaoOrderDetail',{data:JSON.stringify(rowdata.id)})
            return
        }
        if(rowdata.status==3||rowdata.status==4){
            this.props.navigation.navigate('EndOrderDetails',{data:JSON.stringify(rowdata.id)})
            return
        }
        if(rowdata.diningType==2){
            this.props.navigation.navigate('DaiSongOrderDetail',{data:rowdata.id})
            return
        }
        // if(rowdata.status==5)

    }

}
class Heading extends Component{
    constructor(props){
        super(props)
        this.state={
            hisList:[]
        }
    }

    render(){
        Storage.get('searchorder').then((tagss)=>{
            // alert(tagss)
            this.setState({
                hisList:tagss
            })
        })
        if(this.state.hisList!=null){
            // alert('sss')
            for(var j=0;j<this.state.hisList.length;j++){
                pagelist.push(<View style={styles.bord} key={j}><Text style={styles.keyword}>{this.state.hisList[j]}</Text></View>)
            }
        }
        return(<View style={styles.pagelist}>{pagelist}</View>)
    }
}
const styles=StyleSheet.create({
    con:{
        backgroundColor:'#f9f9f9',
        flex:1,
        flexDirection:'column',
    },
    textinput:{
        marginTop:25,
        justifyContent:'center',
        // alignItems:'center',
        flexDirection:'row',
        backgroundColor: "#FFFFFF",
        height:42,
        borderWidth:1,
        borderColor:'#E5E5E5',
        width:Contants.Screen.width-40,
        // marginLeft:10,
        // marginRight:40,
        borderRadius:20,
        alignSelf:'center',
    },
    inputsty:{
        backgroundColor: "#FFFFFF",
        // textAlign: "center",
        height:36,
        // borderWidth:1,
        // borderColor:'#E5E5E5',
        width:Contants.Screen.width-80,
        // marginLeft:10,
        // marginRight:40,
        // borderRadius:20,
        // marginTop:5,
        marginLeft:5
    },
    img:{
        // position:'absolute',
        // marginLeft:Contants.Screen.width-50,
        width:16,height:16,
        // alignSelf:'flex-end',
        // marginTop:40
        marginTop:10,
    },
    his:{
        flexDirection:'row',
        marginTop:26,
        justifyContent:'space-between',

    },
    histext:{
        fontSize:14,
        color:'#282828',
        marginLeft:20
    },
    maleft:{
        marginRight:30
    },
    toux:{
        flexDirection:'row',
        justifyContent:'space-between',
        height:60,
        marginTop:10,
        alignItems:'center',
    },

    bord:{
        borderRadius:4,
        borderWidth:1,
        borderColor:'#E5E5E5',
        height:30,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginLeft:5,marginRight:5,
        marginTop:15
    },
    keyword:{
        fontSize:12,
        color:'#B2B2B2',
        marginLeft:10,marginRight:10,
    },
    item:{
        flexDirection:'column',
        marginLeft:10
    },
    timeview:{
        justifyContent:'flex-end',
        flexDirection:'row',
        marginRight:20,
        marginTop:10
    },
    pagelist:{
        flexDirection:"row",flexWrap:'wrap',marginLeft:10,marginRight:10
    },
    consty:{
        flexWrap:'wrap',
        flexDirection:'row',
        // backgroundColor:'white'
    },
    key:{
        flexDirection:"row",flexWrap:'wrap',marginLeft:10,
    }

})