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
    Platform,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import CheckBox from '../../../common/CheckView'
const s=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
// let b=new Array();
let Headers=[];
export default class ClassifyAdd extends Component{

    constructor(props){
        super(props)
        this.state={

            title:'',
            titls:'',
            k:[],
            destlist:[],
            selectItem:[],
            pickerMore:false,
            isEdict: true,
            selectArray: [],
            array:[],
            imgurls:require('../../../img/window/emptyCircle.png'),
            showimg:false,
            list:[],
            selectImage:false,
            params:'',
            cell:0, //默认选中第一行
            isShowLocate:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            listimage:[],
        }

    }
    // componentWillUnmount(){
    //
    // }

    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }
    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
     postFetch(API.TotalGoods,null,(result)=>{
         // alert(JSON.stringify(result))
         // b=result.data
         if(result.status===1){
             let map = {},
                 dest = [];
             for(let i = 0; i < result.data.length; i++){
                 let ai = result.data[i];
                 if(!map[ai.charAlpha]){
                     dest.push({
                         charAlpha: ai.charAlpha,
                         // name: ai.name,
                         data: [ai]
                     });
                     map[ai.charAlpha] = ai;
                 }else{
                     for(let j = 0; j < dest.length; j++){
                         let dj = dest[j];
                         if(dj.charAlpha === ai.charAlpha){
                             dj.data.push(ai);
                             break;
                         }
                         // alert(JSON.stringify(dj))
                     }

                 }
             }
             // b=dest
             this.setState({
                 destlist:dest,

             })


         }
         console.log(JSON.stringify(this.state.destlist))
         // alert(JSON.stringify(this.state.destlist))
     },(error)=>{
         alert(error)
     })
        this.state.destlist.map((item,i)=>{
            Headers.push(item.charAlpha)
        })

    }
    componentWillUnmount() {
        Headers = [];
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
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

        return(<View style={[comstyle.contain,{backgroundColor:"#f9f9f9"}]}>
            <View style={[comstyle.item,{marginTop:20}]}>
                <Text style={{marginLeft:20}}>添加商品</Text>
                <TouchableOpacity onPress={this.tijjiao.bind(this)}>
                <Image source={require('../../../img/window/press.png')} style={{marginLeft:30}}/>
                </TouchableOpacity>
                {/*onPress={()=>{this.props.navigation.navigate('GoodsAdding')}}*/}
                <TouchableOpacity onPress={()=>{this.setState({isShowLocate:true})}}>
                    <Image source={require('../../../img/window/rightbutton.png')}/>
                </TouchableOpacity>
            </View>
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
                    style={{width:Contants.Screen.width/2+50,flexWrap:'wrap',alignSelf:'flex-end',marginTop:Contants.Screen.height/5}}
                />

            </Modal>
        </View>)
    }
    renderImage=(rowData)=>{
        return(<View style={styles.maimage}>
            <Image source={{uri:rowData.imgUrl}} style={styles.rowimages}/>
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
    _renderRow=(rowData,sectionID,rowID,highlightRow)=>{
        // alert(JSON.stringify(rowData))
        return(<View style={{flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            backgroundColor:'white',
            height:50,marginTop:10}}>
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                <Image source={{uri:rowData.item.imgUrl}} style={{width:45,height:45,marginLeft:20,borderRadius:4}}/>
                <Text style={{marginLeft:10}}>{rowData.item.name}</Text>
            </View>
            <CheckBox onChange={this._change.bind(this,rowData.item)} style={{marginRight:20}}/>
        </View>)
    }
    sectionComp=(info)=>{
        // alert(JSON.stringify(info))
        console.log("ssssssss"+JSON.stringify(info.section.charAlpha))
        return(<Text style={{fontSize:14,marginLeft:20,marginTop:15,marginBottom:10,color:"#282828"}}>{info.section.charAlpha}</Text>)
    }
    _change(info){

        var dou=false
        for (var i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i] == info) {
                dou=true
            }
        }
        if(!dou){
            this.state.list.push(info)
            this.state.listimage.push(info.id)
        }else {
            for (var i = 0; i < this.state.list.length; i++) {
                if (this.state.list[i] == info) {
                    this.state.list.splice(i,1)
                    this.state.listimage.splice(i,1)
                }
            }
        }


        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.list)))
        })

    }
    tijjiao(){
        this.props.navigation.state.params.callbacks()
        // alert(JSON.stringify(this.state.list))

        // 哪里是你的回调？
        const list=this.props.navigation.state.params.data;
        // alert(JSON.stringify(this.state.list))
       postFetch(API.TianJiaFenl,{groupId:list,foodids:this.state.listimage},(result)=>{
           // alert(JSON.stringify(result))
           if(result.status==1) {
               this._toast.show(result.data)
               // this.props.navigation.navigate('ClassifyDetails');

               this.props.navigation.state.params.callbacks('回调')

               this.props.navigation.goBack();
           }
       })
    }

}
const styles=StyleSheet.create({
    modalsty:{
        backgroundColor:"transparent",
        margin:0,
        position:'absolute',
        justifyContent:'flex-end',
        flexDirection:'row',
        marginTop:Contants.Screen.height/7,
        marginLeft:Contants.Screen.width/3
    },
    consty:{
        flexWrap:'wrap',
        flexDirection:'row',
        backgroundColor:'white',

    },
    rowimages:{
        width:45,
        height:45,
        marginLeft:5
    },
    maimage:{
        marginLeft:15,
    }
})