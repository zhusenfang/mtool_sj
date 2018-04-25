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
    SectionList,
    FlatList,
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Contants from '../../../common/Contants'
import CommonModal from '../../CommonPage/ComonModal'
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import CheckBox from '../../../common/CheckView'
var navigation=null
let Headers=[];
export default class AddNewFriCard extends Component{
    static navigationOptions = ({navigation, screenProps}) => ({

        header: null,
        gesturesEnabled: false,

    })

    constructor(props){
        super(props)
        this.state={
            destlist:[],
            k:[],
            list:[],
            isDui:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            listid:[],
            isShowLocate:false,
            cell:0,
        }
        navigation=this.props.navigation
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
    _clickLeftBtn() {
        //返回
        // if(this.state.isDui==false){
        //     this.props.navigation.goBack(null);
        // }else {
        //     alert('sss')
        // }
        this.props.navigation.goBack(null);
    }
    // _clickRightBtn() {
    //     //
    // }
    componentDidMount(){
        // this.props.navigation.setParams({
        //     clickLeftBtn: this._clickLeftBtn.bind(this),
        //     // clickRightBtn: this._clickRightBtn.bind(this)
        // });
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }

        postFetch(API.GuanZhuYonghu,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                var map = {},
                    dest = [];
                for(var i = 0; i < result.data.length; i++){
                    this.setState({
                        k:result.data
                    })
                    var ai = result.data[i];
                    if(!map[ai.charAlpha]){
                        dest.push({
                            charAlpha: ai.charAlpha,
                            // name: ai.name,
                            data: [ai]
                        });
                        map[ai.charAlpha] = ai;
                    }else{
                        for(var j = 0; j < dest.length; j++){
                            var dj = dest[j];
                            if(dj.charAlpha == ai.charAlpha){
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }
                // b=dest
                this.setState({
                    destlist:dest,

                })

            }
        })
        this.state.destlist.map((item,i)=>{
            Headers.push(item.charAlpha)
        })
    }
    itemChange = (info) => {
        let section = info.viewableItems[0].section.charAlpha;

        if (section) {
            let index = Headers.indexOf(section);
            if (index < 0) {
                index = 0;
            }
            this.setState({ cell : index });
        }
    }
    onBackpress(){
        // alert(JSON.stringify(this.state.listid))
        const list=this.props.navigation.state.params.data;
        if(this.state.isDui==false){
            this.props.navigation.goBack()
        }else {
          postFetch(API.AddFirendToNew,{labelId:list,hxUsernames:this.state.listid},(result)=>{
              // alert(JSON.stringify(result))
              if(result.status==1){
                  this._toast.show(result.msg)
              }
          },(error)=>{
              alert(error)
          })
        }
    }
    render(){
        return(<View style={comstyle.con}>
            <CommonModal style={{position:'absolute', zIndex:1000,}}  navigation={navigation}/>
            <View  style={styles.headerContainer}>
                {/*内容*/}
                <Text allowFontScaling={false} style={styles.middleTitle}>
                    添加好友到新标签
                </Text>

                {/*左边返回按钮*/}
                <TouchableOpacity style={styles.leftImgBtn} onPress={this.onBackpress.bind(this)}>
                    <Image source={this.state.isDui==false?require("../../../img/page/arrow.png"):require('../../../img/window/press.png')}/>
                </TouchableOpacity>


                {/*<View style={styles.leftImgBtn}/>*/}

            </View>
            <TouchableOpacity onPress={()=>{this.setState({isShowLocate:true})}} style={{position:'absolute',zIndex:10000,width:55,height:45,alignSelf:'flex-end',marginTop:75}}>
            <Image source={require('../../../img/window/rightbutton.png')} style={styles.she}/>
            </TouchableOpacity>
            <SectionList
                ref='sectionList'
                renderSectionHeader={this.sectionComp}
                // dataSource={this.state.dataSource}
                renderItem={this._renderRow}
                sections={this.state.destlist}
                keyExtractor={ (item) => item.name }
                // scrollToIndex={()=>{}}
                onViewableItemsChanged = {(info)=>this.itemChange(info)}  //滑动时调用
            />
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderImage}
            enableEmptySections={true}
            horizontal={true}
            />
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='center'
            />
            <Modal
                isVisible={this.state.isShowLocate}
                hideOnBack={true}
                transparent={true}
                // style={styles.modalsty}
                backdropColor='transparent'
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                // backdropOpacity={0.3}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowLocate: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <FlatList
                    ref='FlatList'
                    // style
                    data={this.state.destlist}
                    renderItem={this._renderItem}
                    // horizontal={true}
                    contentContainerStyle={styles.consty}
                    // numColumns={4}
                    keyExtractor={ (item) => item.charAlpha}
                    style={styles.flatlist}
                />

            </Modal>
        </View>)
    }
    _renderItem=(item)=>{
        return(
            <TouchableOpacity style={{backgroundColor:'#ffffff',borderRadius:4,borderWidth:1,borderColor:'#E5E5E5',height:45,width:45,
                marginLeft:10,alignItems:'center',justifyContent:'center',marginTop:10}}
                // onPress={this.cellAction(item)}
                              onPress={()=>this.cellAction(item)}
            >
                <Text style={{fontSize:16,color:'#FF305E'}}>{item.item.charAlpha}</Text>
            </TouchableOpacity>)
    }
    cellAction=(item)=>{
        // alert(item.index)
        this.setState({
            isShowLocate:false
        })
        if (item.index <= this.state.destlist.length) {
            this.setState({
                cell : item.index
            });
            if (item.index > 0) {
                var count = 0;
                for (var i = 0;
                     i < item.index;
                     i++) {
                    count += this.state.destlist[ i ].data.length + 2
                    // alert(count)
                }
                this.refs.sectionList.scrollToIndex({ animated : false, index : count })

            } else {
                this.refs.sectionList.scrollToIndex({ animated : false, index : 0 });
            }

        }
    }
    renderImage=(rowData)=>{
        return(<View style={styles.maimage}>
             <Image source={{uri:rowData.userMember.picUrl}} style={styles.rowimages}/>
        </View>)
    }
    _renderRow=(rowData,sectionID,rowID,highlightRow)=>{
        // alert(JSON.stringify(rowData))
        return(
            <View style={{flexDirection:'column'}}>
            <View style={{flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            backgroundColor:'white',
            height:60,marginTop:10}}>
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                <Image source={{uri:rowData.item.userMember.picUrl}} style={{width:45,height:45,marginLeft:20,borderRadius:4}}/>
                <Text style={{marginLeft:10}}>{rowData.item.userMember.nickname}</Text>
            </View>
            <CheckBox onChange={this._change.bind(this,rowData.item)} style={{marginRight:20}}/>
        </View><View style={comstyle.heng}/>
            </View>)
    }
    sectionComp=(info)=>{
        // alert(JSON.stringify(info))
        return(<Text style={{fontSize:14,marginLeft:20,marginTop:15,marginBottom:10,color:"#282828"}}>{info.section.charAlpha}</Text>)
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
            this.state.listid.push(info.userMember.hxUsername)
            // this.setState({
            //     isDui:true
            // })
        }else {
            for (var i = 0; i < this.state.list.length; i++) {
                if (this.state.list[i] == info) {
                    this.state.list.splice(i,1)
                    this.state.listid.splice(i,1)
                    // this.setState({
                    //     isDui:false
                    // })
                }
            }
        }
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.list))),
            isDui:true
        })

    }
}
//   class renderHeader extends Component{
//     render(){
//     return(<View>
//         <CommonModal style={{position:'absolute', zIndex:1000,}}  />
//         <View  style={styles.headerContainer}>
//             {/*内容*/}
//             <Text allowFontScaling={false} style={styles.middleTitle}>
//                 添加好友到新标签
//             </Text>
//
//             {/*左边返回按钮*/}
//             <TouchableOpacity style={styles.leftImgBtn} onPress={() => {
//
//                this.props.navigation.goBack()
//             }}>
//                 <Image source={this.state.isDui==false?require("../../../img/page/arrow.png"):require('../../../img/window/press.png')}/>
//             </TouchableOpacity>
//
//
//             <View style={styles.leftImgBtn}/>
//
//         </View>
//     </View>)}
// }
const styles=StyleSheet.create({
    she:{
       position:'absolute',
        // marginTop:75,
        // alignSelf:'flex-end',
        zIndex:100,
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
        alignSelf:'flex-end',
        marginRight:Contants.Screen.width/6+25.5,
    },

    middleTitle: {

        fontSize: 18,
        marginLeft:20,
    },
    image:{
        position:'absolute',

    },
    rowimages:{
        width:45,
        height:45,
        marginLeft:5
    },
    maimage:{
        marginLeft:15,
    },
    consty:{
        flexWrap:'wrap',
        flexDirection:'row',
        backgroundColor:'white',

    },
    flatlist:{
        width:Contants.Screen.width/2+20,flexWrap:'wrap',alignSelf:'flex-end',marginTop:Contants.Screen.height/5
    }
})