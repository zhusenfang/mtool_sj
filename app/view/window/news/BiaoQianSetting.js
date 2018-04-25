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
import Contants from '../../../common/Contants'
import CommonModal from '../../CommonPage/ComonModal'
import Toast from "react-native-easy-toast";
import CheckBox from '../../../common/CheckView'
var item=""
export default class BiaoQianSetting extends Component{
    constructor(props){
        super(props)
        this.state={
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            list:[],
            newlist:[],
            oldlist:[],
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
        const list=this.props.navigation.state.params.data;
        postFetch(API.BiaoQianSetting,{memberId:list},(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    newlist:result.data
                })

            }
        })
        postFetch(API.BiaoQianGuanli,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
              this.setState({
                  dataSource:this.state.dataSource.cloneWithRows(result.data),
                  oldlist:result.data,
              })
            }
        })
    }
    render(){
        return(<ScrollView style={[comstyle.con,{flexDirection:'column'}]}>
            {/*<Text>ddd</Text>*/}
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderItem}
            enableEmptySections={true}
            style={styles.matip}
            />
            <TouchableOpacity style={styles.baoc} onPress={this.baocun.bind(this)}>
               <Text style={styles.baocun}>保存</Text>
            </TouchableOpacity>
            <Toast ref={(e) => {
                this._toast = e
            }}
                   position='top'
            />
        </ScrollView>)
    }
    renderItem=(rowData,sectionID,rowID)=>{
        // for(var i=0;i<this.state.newlist.length;i++){
        //     if(this.state.newlist[i].id==rowData.id){
        //         item=this.state.newlist[i].id
        //     }isChecked={item==rowData.id?true:false}
        // }

        return(<View style={{flexDirection:'column'}}>
            <View style={[comstyle.item,{marginTop:0}]}>
                <Text style={styles.maleft}>{rowData.name}</Text>

                <CheckBox onChange={this._change.bind(this,rowData.id)} style={{marginRight:20}} />
            </View>
            <View style={comstyle.heng}/>
        </View>)
    }
    contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            // alert(JSON.stringify(arr))
            if (arr[i] == obj) {
                // alert(JSON.stringify(arr[i]))
                return true;
            }
        }
        return false;
    }
    _change(info){
       //  var listths=[]
       // for(var h=0;h<this.state.oldlist.length;h++){
       //  for(var j=0;j<this.state.newlist.length;j++){
       //      if(this.state.oldlist[h].id==this.state.newlist[j].id){
       //          listths.push(this.state.newlist[j].id)
       //      }
       //  }
       // }
       //  var sh=''
       //  for(var j=0;j<this.state.newlist.length;j++){
       //      sh=this.state.newlist[j].id
       //  }
       // alert(JSON.stringify())
     // let mergeObj={};
     // [...this.state.oldlist,...this.state.newlist].map(v=>{
     //     mergeObj[v.id]=v.id
     // })this.state.list.indexOf(sh)>0
     //    const mergeArr=Object.values(mergeObj)
     //    alert(JSON.stringify(mergeObj))

       var listth=[]
        var dou=false
        for (var i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i] === info) {
                dou=true
                // listth.push(this.state.list[i])
                // this.state.list.push(listths)
            }
        }

        if(!dou){
            this.state.list.push(info)
            // this.state.list.push(listths)

        }else {
            for (var i = 0; i < this.state.list.length; i++) {
                if (this.state.list[i] === info) {
                    this.state.list.splice(i,1)
                }
            }
        }

        // for(var i=0;i<this.state.oldlist.length;i++){
        //
        // }

    }
    baocun(){
        var tem =this
        // alert(JSON.stringify(this.state.list))
        const list=this.props.navigation.state.params.data;
     postFetch(API.YingHuSetting,{memberId:list,labelIds:this.state.list},(result)=>{
         // alert(JSON.stringify(result))
         if(result.status==1){
             this._toast.show(result.msg)
             setTimeout(function () {
                 tem.props.navigation.goBack()
             },600)
         }
     })
    }
}
const styles=StyleSheet.create({
  baoc:{
      width:335,
      height:35,
      borderRadius:4,
      borderWidth:1,
      borderColor:'#FF305E',
      marginTop:20,
      backgroundColor:'white',
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center',
  },
    maleft:{
      fontSize:14,
      color:'#282828',
      marginLeft:20
    },
    baocun:{
       fontSize:14,
        color:'#FF305E',
    },
    matip:{
      marginTop:20
    }

})