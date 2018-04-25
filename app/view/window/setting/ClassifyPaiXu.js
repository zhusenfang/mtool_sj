import React, { Component,PropTypes} from 'react';
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
    PanResponder,
    BackHandler,
    Platform
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst'
const s=[]
export default class ClassifyPaiXu extends Component{


    constructor(props){
        super(props)

        this.state={
          dataSource: new ListView.DataSource({
              rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            items:[],
            order:[],
            list:[],
            xiaid:'',
            sourNo:'',
            // dataSource: ds.cloneWithRows(this.datas)
      }
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
    componentDidMount(){
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        postFetch(API.ListOrder,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                // this.datas=
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(result.data))),
                    list:result.data
                })
            }
        },(error)=>{
            // alert(error)
        })
    }
    render(){
        // alert(JSON.stringify(this.state.list))
          return(
            <View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
                {/*listview*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                   style={{marginTop:20}}
                />
                {/*{this.state.list.map((item,i)=>{*/}
                    {/*return(*/}
                        {/*<View>*/}
                            {/*ref={(ref) => this.state.items[i] = ref}*/}
                            {/*key={i}*/}
                            {/*style={[styles.item, {top: (i+1)*49}]}>*/}
                            {/*<Icon name="ios-menu" size={25} color="#ccc"/>*/}
                            {/*<Text style={styles.itemTitle}>{item}</Text>*/}
                        {/*</View>*/}
                    {/*)*/}
                {/*})}*/}

                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
          </View>)
      }







    _renderRow=(rowData,sectionID,rowID)=>{
        // alert(rowID)
        return(<View style={{justifyContent:'space-between',flexDirection:'row',backgroundColor:'white',alignItems:'center',height:50,marginTop:10}}>
            <Text style={{marginLeft:20,fontSize:14,color:'#282828'}}>{rowData.groupName}</Text>
            {/*<Text>{"x"+rowData.quantity}{"  /  "+rowData.price+'元'}</Text>*/}
            <View style={styles.laji}>
                <TouchableOpacity onPress={()=>this.updown(rowID,rowData,rowData.id,rowData.sortNo)}>
                    <Image source={require('../../../img/window/down.png')} style={styles.img}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.lowdown(rowID,rowData,rowData.id,rowData.sortNo)}>
                    <Image source={require('../../../img/window/up.png')} style={styles.img}/>
                </TouchableOpacity>
            </View>
        </View>)

    }
    updown(rowID,rowData,rowid,rowsort){

        // this.setState({
        //
        // })
        //  delete this.state.list[rowID];
        //     // this.state.list.insert(2,rowData)
        //  // this.state.list.splice(rowID,1)
        // this.setState({
        //     dataSource:this.state.dataSource.cloneWithRows(this.state.list)
        // })
       // var num=this.state.list;
       //  num.insertRow(2)
        let array=[]
        var flag
        let items
        // for(var i=0;i<this.state.list.length;i++){
        //     // if(this.state.list[0]){
        //     //     this._toast.show('不能移动')
        //     //     return
        //     // }
        //     if(i==this.state.list.length-1){
        //         // this._toast.show('不能向下排序了')
        //         return
        //     }
        //
        //
        //     if(rowData==this.state.list[i]&&i<this.state.list.length-1){
        //
        //         items=this.state.list[i+1]
        //         postFetch(API.PaiXu,{foodGroup:{id:rowid,sortNo:rowsort},foodGroupExchange:{id:items.id
        //             ,sortNo:items.sortNo
        //         }},(result)=>{
        //             // alert(JSON.stringify(result))
        //           if(result.status==1){
        //
        //           }
        //         })
        //         array.push(this.state.list[i+1])
        //         flag=i
        //         // let array=this.state.list[i+2]
        //         // this.setState({
        //         //     order:this.state.order.push(items)
        //         // })
        //     }else if(i==flag+1){
        //         array.push(this.state.list[flag])
        //     }else {
        //         array.push(this.state.list[i])
        //     }
        //     this.setState({
        //         dataSource:this.state.dataSource.cloneWithRows(array)
        //     })
        //
        // }

       var temp=[]
         for (let i=0;i<this.state.list.length;i++){
             // alert(i)
             if(i==rowID&&i<this.state.list.length-1){
                 // 后面这三行是调换位置的方法
                 temp= this.state.list[i];
                 this.state.list[i] = this.state.list[i+1];
                 this.state.list[i+1] = temp;
                 items=this.state.list[i+1]
                 //位置更改请求数据
                 postFetch(API.PaiXu,{foodGroup:{id:rowid,sortNo:rowsort},foodGroupExchange:{id:items.id
                                 ,sortNo:items.sortNo
                             }},(result)=>{
                                  // alert(JSON.stringify(result))
                               if(result.status==1){

                               }
                             })

             }
         }
         let arr=this.state.list;
        this.setState({
             dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.list)))
            // order:this.state.list,
            // dataSource:this.state.dataSource.cloneWithRows(this.state.order)
        })
        // alert(JSON.stringify(temp))
        // alert(JSON.stringify(this.state.list))


    }
    lowdown(rowId,rowData,rowid,rowsort){
        var temp=[]
        let items
        for(let i=0;i<this.state.list.length;i++){
            if(i==rowId&&i!=0){
                temp=this.state.list[i];
                this.state.list[i]=this.state.list[i-1];
                this.state.list[i-1]=temp;
                items=this.state.list[i-1]
                //位置更改请求数据
                postFetch(API.PaiXu,{foodGroup:{id:rowid,sortNo:rowsort},foodGroupExchange:{id:items.id
                    ,sortNo:items.sortNo
                }},(result)=>{
                    // alert(JSON.stringify(result))
                    if(result.status==1){

                    }
                })
            }
        }
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.state.list)))
        })
    }
}
const styles=StyleSheet.create({
    img:{

        marginRight:20
    },
    texts:{
        marginRight:20
    },
    laji:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    item: {
        flexDirection: 'row',
        height:49,
        width: Contants.Screen.width,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 20,
        borderBottomColor: 'black',
        borderBottomWidth: Contants.Screen.width,
        position: 'absolute',
    },
    itemTitle: {
        fontSize: 15,
        color: '#000',
        marginLeft: 20
    }
})