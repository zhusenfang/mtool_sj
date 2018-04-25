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
    SectionList,
    FlatList,
    DeviceEventEmitter,
    Platform,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst'
let Headers=[];
export default class GuanZhuUser extends Component{
    constructor(props){
        super(props)
        this.state={
            destlist:[],
            k:[],
            list:[],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            cell:0,
            isShowLocate:false,

        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentDidMount(){
        // this.props.navigation.setParams({
        //     clickLeftBtn: this._clickLeftBtn.bind(this),
        //     // clickRightBtn: this._clickRightBtn.bind(this)
        // });
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}

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
    componentWillUnmount() {
        Headers = [];
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    };
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
    render(){
        return(<View style={comstyle.con}>
            <TouchableOpacity onPress={()=>{this.setState({isShowLocate:true})}} style={{position:'absolute',zIndex:100,width:100,height:90,alignSelf:'flex-end',}}>
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
                    style={{width:Contants.Screen.width/2+50,flexWrap:'wrap',alignSelf:'flex-end',marginTop:Contants.Screen.height/5}}
                />

            </Modal>
        </View>)
    }

    _renderRow=(rowData,sectionID,rowID,highlightRow)=>{
        // alert(JSON.stringify(rowData))
        return(
            <View style={{flexDirection:'column'}}>
            <View style={styles.btom}>
            <TouchableOpacity style={styles.rowitem} onPress={this.guanzhu.bind(this,rowData.item.userMember.id)}>
                <Image source={{uri:rowData.item.userMember.picUrl}} style={{width:45,height:45,marginLeft:20,borderRadius:4}} />
                <Text style={{marginLeft:10}}>{rowData.item.userMember.nickname}</Text>
            </TouchableOpacity>
            {/*<CheckBox onChange={this._change.bind(this,rowData.item)} style={{marginRight:20}}/>*/}
        </View>
           <View style={comstyle.heng}/>
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

        // this.refs.sectionList.scrollToIndex({ animated : false, index : item.index });

        if (item.index <= this.state.destlist.length) {
            this.setState({
                cell : item.index
            });
            if (item.index > 0) {
                var count = 0;
                for (var i = 0; i < item.index;
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
    guanzhu(id){
       this.props.navigation.navigate('UserDetails',{data:id})
    }
    sectionComp=(info)=>{
        // alert(JSON.stringify(info))
        return(<Text style={{fontSize:14,marginLeft:20,marginTop:15,marginBottom:10,color:"#282828"}}>{info.section.charAlpha}</Text>)
    }
}
const styles=StyleSheet.create({
    she:{
        position:'absolute',
        marginTop:15,
        alignSelf:'flex-end',
        zIndex:100
    },
    rowitem:{
        flexDirection:'row',justifyContent:'flex-start',alignItems:'center'
    },
    btom:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        height:60,marginTop:10
    }

})