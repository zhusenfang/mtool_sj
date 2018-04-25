import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView,
    AppState,
    ScrollView,
    Button
} from 'react-native';
import Contants from '../../../common/Contants';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabBar from '../../../common/DfyTabBar'
import {API,postFetch} from '../../../common/GConst'
import Toast from "react-native-easy-toast";
import SearchPage from '../../SearchPage'
import OrderPage from '../../OrderPage'
import {Container, Tab, Tabs,TabHeading} from 'native-base';
import MyTimer from '../../../common/MyTimer'
// var TimerMixin=require('react-timer-mixin');
import Modal from 'react-native-modal'
// var comdtime=600;
import CheckBox from '../../CommonPage/GGCheckView'
// const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
import RadioModal from 'react-native-radio-master';
import comstyle from '../../../common/CommonStyle'
var mSelectWhat = -1;
export default class RefuseOrder extends Component {
    constructor(props){
        super(props);
        this.state={
            issueList:[],
            checkArray: [true, false, false],
            repaireId: 1,
            sec:'',
            third:'',
            isShowModal:false,
            isChangeName:false,
            changeTime:'',
            isEdict: true,//是否编辑状态
            selectArray: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            list:[],
            isImage:require('../../../img/window/emptyCircle.png'),
            selectImage:false,
            item:'',
            language:"0",
        }

    }
    componentDidMount(){
        postFetch(API.RefuseOrder,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                // this.setState({
                //     // issueList:result.data[0].content,
                //     // sec:result.data[1].content,
                //     // third:result.data[2].content,
                //      dataSource:this.state.dataSource.cloneWithRows(result.data),
                //     list:result.data
                // })
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
                    dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
                })
               //  let array=result.data;
               //  let newArray=[]
               //  for(let i=0;i<result.data.length;i++){
               //      let dict=result.data[i]
               //      dict.isSelect=false;
               //      newArray.push(dict)
               //  }
               //  alert(JSON.stringify(newArray))
               // this.setState({
               //     dataSource:this.state.dataSource.cloneWithRows(newArray),
               //     list:newArray
               // })
            }
        },(error)=>{
            alert(error)
        })
    }
    tijiaos(){
        const list=this.props.navigation.state.params.data;
        this.state.isChangeName==true
        postFetch(API.BuChongOrder,{orderDiningRefund:{orderId:list,reason:this.state.item,reasonAddition:this.state.changeTime}},
            (result)=>{
                // alert(JSON.stringify(result))
                // alert(this.state.item)
                if(result.status==1){
                    this._toast.show('提交成功')
                    this.props.navigation.navigate('Index')
                }
            },(error)=>{
                alert(error)
            })
    }
       render(){
           const list=this.props.navigation.state.params.data;
           return(

               <View style={styles.contain}>
                   <TouchableOpacity style={styles.sure} onPress={this.tijiaos.bind(this)}>
                   <Image source={require('../../../img/window/tijiao.png')} style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                       <Text style={{color:'#FF305E',fontSize:14}} onPress={this.tijiaos.bind(this)}>确认提交</Text>
                   </Image>
                   </TouchableOpacity>
                   <View style={styles.ben}>
                       <View style={comstyle.rightview}>
                           <Image source={require('../../../img/order/buchong.png')} style={comstyle.maleft}/>
                       <Text style={comstyle.mesg}>补充说明</Text>
                       </View>
                       <View style={styles.shezhi}>
                       <Text style={styles.min}>{this.state.isChangeName==true?this.state.changeTime:'未设置'}</Text>
                           <TouchableOpacity onPress={()=>{
                               this.setState({
                                   isShowModal:true
                               })
                           }}>
                       <Image source={require('../../../img/window/write.png')} style={styles.img}/>
                           </TouchableOpacity>
                       </View>
                   </View>

                   <ListView
                       dataSource={this.state.dataSource}
                       renderRow={this._renderRow.bind(this)}
                   />


                   <Modal
                       isVisible={this.state.isShowModal}
                       hideOnBack={true}
                       transparent={true}
                       style={styles.modalstyle}
                       //backdropColor='transferent'
                       backdropOpacity={0.3}
                   >
                       {/*点击外框，键盘消失*/}
                       <TouchableOpacity
                           onPress={() => {
                               this.setState({isShowModal: false});

                           }}
                           style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                       />
                       <View style={{flexDirection:'column',backgroundColor:'white',borderRadius:5}}>
                           <Text style={{margin:10}}>补充说明</Text>
                           <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                           <View style={{height:60,width:Contants.Screen.width,alignItems:'center',justifyContent:'center'}}>
                           <TextInput
                               ref={e => this._nameInput = e}
                               underlineColorAndroid='transparent'
                               style={{
                                   backgroundColor: "#FFFFFF",
                                   textAlign: "center",
                                   height:40,
                                   borderWidth:1,
                                   borderColor:'#E5E5E5',
                                   width:Contants.Screen.width-80,
                                   // marginLeft:10,
                                   marginRight:40
                               }}
                               onChangeText={(e)=>{
                                   this.setState({
                                       changeTime:e,
                                   })
                               }}
                               placeholderTextColor="#B2B2B2"
                               multiline={true}
                               placeholder={'输入补充说明'}/>
                           </View>
                           <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
                           <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'white',justifyContent:'center',borderRadius:5,height:40}}>
                           <TouchableOpacity title={'返回'} color={'#F0F0F0'} onPress={()=>{
                                   this.setState({
                                       isShowModal:false
                                   })
                               }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                               <Text>返回</Text>
                           </TouchableOpacity>
                               <View style={{height:40,width:1,backgroundColor:'#E5E5E5'}}/>
                               <TouchableOpacity title={'确定'} color={'#F0F0F0'} onPress={()=>{
                                   if(this.state.changeTime.length==0){
                                       this._toast.show('补充说明不能为空');
                                       return
                                   }
                                   // postFetch(API.RefuseOrderShuoM,{},(result)=>{
                                   //     alert(JSON.stringify(result))
                                   // })
                                   this.setState({
                                       isChangeName:true,
                                       isShowModal:false
                                   })

                               }} style={{justifyContent:'center',alignItems:"center",flex:1}}>
                                   <Text>确定</Text>
                               </TouchableOpacity>
                           </View>
                       </View>

                   </Modal>
                   <Toast ref={(e) => {
                       this._toast = e
                   }}
                          position='center'
                   />
           </View>)
       }
       itemView=()=>{
           let List=this.state.issueList
            // alert(JSON.stringify(List))

           return(
               <View style={{backgroundColor:'yellow'}}>
                   {List.map((item,i)=>{
                       return(
                       <CheckBox
                           key={i}
                           style={{backgroundColor: "white", padding: 10, paddingHorizontal: 20}}
                           onClick={this.selectRepaireType(this,item.id,i)}
                           leftText={item.content}
                           isChecked={this.state.checkArray[i]}
                       />
                        )
                   })}
               </View>
           )
       }
       selectRepaireType(repairid,index){
          this.setState({
            repaireId:repairid
        })
           var tempArray = this.state.checkArray;
          for(let i=0;i<this.state.checkArray.length;i++){
              if(i==index){
                  tempArray[i]=true
              }else {
                  tempArray[i]=false
              }
          }
          this.setState({
              checkArray:tempArray
          })
           // alert(index)
       }
    _renderRow(rowData,sectionID,rowID){
           return(
               <View>
               <View style={styles.con}>
              <Text style={comstyle.maleft}>{rowData.content}</Text>
               {/*<TouchableOpacity onPress={this.item.bind(this,rowId,rowData)}>*/}
               {/*<Image source={this.state.selectImage==false?require('../../../img/window/emptyCircle.png'):require('../../../img/window/strokeCircle.png')}/>*/}
               {/*</TouchableOpacity>*/}
               <TouchableOpacity onPress={()=>{this._selectRow(rowData,rowID)}}>
                   <Image source={rowData.isCheck==true?require('../../../img/window/goupress.png'):require('../../../img/window/gouunpress.png')} style={comstyle.textright}/>
                   {/*{model.isCheck&&<Image source={require('../../../img/window/strokeCircle.png')}/>}*/}
               </TouchableOpacity>
           </View>
                   <View style={{width:Contants.Screen.width,height:1,backgroundColor:'#E5E5E5'}}/>
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
                        // postFetch(API.FeiYongReset,{deliveryId:this.LetAll[i]['id']},(result)=>{
                        //     // alert(JSON.stringify(result))
                        //     if(result.status==1){
                        //         this._toast.show('更改成功')
                        //     }
                        // })
                        this.setState({
                            item:item.content
                        })
                        // alert(item.content)
                    }
                }else {
                    this.LetAll[i]['isCheck']=false
                }
            })
        }

        this.setState({

            dataSource:this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.LetAll)))
        })
        // alert(JSON.parse(JSON.stringify(this.LetAll[i]['isCheck'])))
        // if(JSON.parse(JSON.stringify(item.isCheck==true))){
        //     alert('sss')
        // }
        // alert(JSON.stringify(this.LetAll))
    }


    //是否选中
    // renderShowEditView(isEdict, rowData, index, onPress) {
    //     if (isEdict == true) {
    //         let imageURL = require('../../../img/window/emptyCircle.png')
    //         if (rowData.isSelect == true) {
    //             imageURL = require('../../../img/window/strokeCircle.png')
    //         }
    //         return (
    //             <TouchableOpacity onPress={()=> {
    //                 onPress(rowData, index)
    //             }} style={{height: 111, width: 40, justifyContent: 'center', alignItems: 'center'}}>
    //                 <Image style={{width: 30, height: 30}} source={imageURL}/>
    //             </TouchableOpacity>
    //         )
    //     }
    // }
    //左边按钮选择
    // rightOnPress = (rowData, index)=> {
    //     let selectArray = this.state.selectArray;
    //     let data = this.state.list;
    //     let newArray = []
    //     for (let i = 0; i < data.length; i++) {
    //         let dict = data[i];
    //         if (index == i) {
    //             if (dict.isSelect == true) {
    //                 dict.isSelect = false
    //                 for (let j = 0; j < selectArray.length; j++) {
    //                     let id = selectArray[j];
    //                     if (id == dict.id) {
    //                         selectArray.splice(j, 1);
    //                     }
    //                 }
    //             } else {
    //                 dict.isSelect = true
    //                 selectArray.push(dict.id);
    //             }
    //         }
    //         newArray.push(dict);
    //     }
    //     this.setState({
    //         selectArray: selectArray,
    //         dataSource: this.state.dataSource.cloneWithRows(newArray)
    //     });
    // }

}
const styles=StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    sure:{
        justifyContent:'center',
        marginTop:20,

        // backgroundColor:'white',
        // marginLeft:Contants.Screen.width/2+20,
        alignItems:'center'
    },
    img:{
        width:20,
        height:20,
        marginRight:10
    },
    ben:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        marginTop:20,
        height:46
    },
    shezhi:{
        justifyContent:'flex-end',
        flexDirection:'row'
    },
    min:{
        marginRight:20
    },
    con:{
        width:Contants.Screen.width,

        flexDirection:'row',
        justifyContent:'space-between',
        height:50,
        backgroundColor:'white',
        alignItems:'center'
    }
})