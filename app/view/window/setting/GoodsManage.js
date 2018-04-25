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
const s=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
// const ;
let Headers=[];
export default class MainSetting extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            dataSourcea: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            title:'',
            titls:'',
            k:[],
            destlist:[],
            cell:0, //默认选中第一行
            isShowLocate:false
        }
    }
    componentWillUnmount(){
        Headers = [];
        if(Platform.OS==='android'){
            BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
        }
    }

    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        postFetch(API.TotalGoods,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                var map = {},
                dest = []
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
              this.setState({
                  destlist:dest
              })
                // alert(JSON.stringify(this.state.destlist))
                // for(var i=0;i<s.length;i++){
                // var first=[];
                // for(var j=0;j<result.data.length;j++){
                //
                //     if(result.data[j].charAlpha.toUpperCase()==s[i]){
                //         first.push(result.data[j])
                //
                //     }
                //
                // }
                // // alert()
                // if(first.length > 0 ){
                //     // var second  = JSON.parse(JSON.stringify((first)))
                //     this.setState({
                //         title:first[0].charAlpha,
                //         dataSource:this.state.dataSource.cloneWithRows(first)
                //     })
                // }
                //
                // // alert(JSON.stringify(first))
                // //  break;
                //  }
                // this.setState({
                //     dataSource:this.state.dataSource.cloneWithRows(dest[7])
                // })
                // alert(JSON.stringify(dest))
                // if(result.data)
                // for(var i=0;i<result.data.length;i++){

                // if(result.data[i].charAlpha=='F'){
                //
                //     this.setState({
                //         k:result.data,
                //         title:'F',
                //         dataSource:this.state.dataSource.cloneWithRows(result.data)
                //     })
                // }else {
                //     if(result.data[i].charAlpha=='K'){
                //         this.setState({
                //             titles:result.data[i].charAlpha,
                //             dataSourcea:this.state.dataSourcea.cloneWithRows(result.data)
                //         })
                //     }else {
                //
                //     }
                // }
                // }
            }


        },(error)=>{
            alert(error)
        })
        this.state.destlist.map((item,i)=>{
            Headers.push(item.charAlpha)
        })

    }
    // componentWillUnmount() {
    //
    // };
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
        // alert(JSON.stringify(dest))

        return(<View style={[comstyle.contain,{backgroundColor:"#f9f9f9"}]}>
            <View style={[comstyle.item,{marginTop:20}]}>
                <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} onPress={()=>{
                    this.props.navigation.navigate('GoodsAdding')
                }}>
                <Image source={require('../../../img/window/tianjia.png')} style={comstyle.maleft}/>
               <Text style={[comstyle.text,{marginLeft:10}]}>添加商品</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this.setState({
                        isShowLocate:true
                    })
                    }}>
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
            <Modal
             isVisible={this.state.isShowLocate}
             hideOnBack={true}
             transparent={true}
             style={styles.modalsty}
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
          keyExtractor={ (item) => item.charAlpha }
          style={{width:Contants.Screen.width/2+20,flexWrap:'wrap',}}
          />

         </Modal>
        </View>)
    }
    //
    // keyExtractor(item:Object,index:number){
    //     return item.charAlpha
    // }
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


    _renderRow=(rowData,sectionID,rowID,highlightRow)=>{
        // alert(JSON.stringify(rowData))
        return(<View style={{flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            backgroundColor:'white',
            height:50,marginTop:10}}>
            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                <Image source={{uri:rowData.item.imgUrl}} style={{width:45,height:45,marginLeft:20}} />
                <Text style={[comstyle.text,{marginLeft:10}]}>{rowData.item.name}</Text>
            </View>
            <TouchableOpacity onPress={this.xiugai.bind(this,rowID,rowData.item.id)}>
            <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20 }]}/>
            </TouchableOpacity>
        </View>)
    }
    sectionComp=(info)=>{
        // alert(JSON.stringify(info))
        return(<Text style={{fontSize:14,marginLeft:20,color:"#282828",marginTop:10}}>{info.section.charAlpha}</Text>)
    }
    xiugai(rowId,rowdata){
      this.props.navigation.navigate('BianJiGoods',{data:rowdata,callback:(data)=>{}});
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
})