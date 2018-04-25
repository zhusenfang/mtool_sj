import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,ListView,ScrollView
} from 'react-native';
import Contants from '../../common/Contants';
import CheckBox from '../CommonPage/GGCheckView';
import Storage from '../../common/GGAsyncStorage'
var pagelist=[]
export default class RestaurantView extends Component {
    constructor(props){
        super(props)
        this.state={
            failureId:1,
            tags:[]
        }

    }
    render(){
        Storage.get('search').then((tagss)=>{
            // alert("len"+tagss.toString())
            // if(tagss==null){
            //     tagss = new Array();
            // }
            // tagss.push(his)
            // // AsyncStorage.setItem('search', JSON.stringify(tagss),);
            // this.state.tags.push(his);
            // // alert(tagss.toString())
            this.setState({
                tags:tagss
            })
        })


         // alert(this.state.tags.toString())
        var page=new Array();
        if(this.state.tags.length!=0) {
        for(var i=0;i<this.state.tags.length;i++){
            // alert(this.state.tags.pop(i))



            pagelist.push(<Text key={i} style={{marginLeft: 10, marginRight: 10}}>{this.state.tags[i]}</Text>)
        }
        }
        return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
            <Image
            source={require('../../img/window/sousuo.png')}
            style={styles.ing}

            >
                {/*<TextInput style={styles.textinput}*/}
                  {/*underlineColorAndroid={"transparent"}*/}
                 {/*placeholder={"输入手机号/姓名/地址"}*/}
                {/*/>*/}
                <Text style={styles.textinput} onPress={this.search.bind(this)}>输入手机号/姓名/地址</Text>
                <Image source={require('../../img/page/srarch.png')} style={{width:16,height:16,marginTop:5}}/>
            </Image>
            <View style={styles.waisong}>
                <View style={styles.waisongitem}>
                <Image source={require('../../img/window/warsong.png')} style={{width:120,height:35}}>
               <CheckBox
                   ref={(e) => this._doorBreak = e}
                   rightText={'外送订单'}
                   onClick={()=>this.checkAction(1)}
                     isChecked={true}
               />

                </Image>
                </View>
                <View style={styles.waisongitem}>
                <Image source={require('../../img/window/warsong.png')} style={{width:90,height:35}}>
                    <CheckBox
                        ref={(e) => this._doorBreaks = e}
                        rightText={'到店订单'}
                        onClick={()=>this.checkAction(2)}
                        isChecked={false}
                    />

                </Image>
                </View>
            </View>
            <View style={styles.history}>
            <Text>历史搜索</Text>
                <View style={styles.laji}>
                <Text onPress={this.delecthistroy.bind(this)}>垃圾桶</Text>
                    <Text>...</Text>
                </View>
            </View>
            <View style={styles.heng}/>
            <ScrollView style={{width:Contants.Screen.width,marginTop:10}} contentContainerStyle={{backgroundColor:"white"}}>
            <View style={{flexDirection:"row",flexWrap:'wrap'}}>

                {/*<Text>{this.state.tags.toString()}</Text>*/}
                {pagelist}
            </View>
            </ScrollView>
        </View>)
    }
search(){

        this.props.navigation.navigate('RestaurantSec',{title:this.state.failureId.toString()})
}

delecthistroy(){
    Storage.delete('search').then((tags)=>{
        this.setState({
            tags:''
        })
    })
   pagelist.splice(0,pagelist.length)
    // this.setState({
    //
    // })
    // alert(this.state.tags)
}
checkAction(index){
    this.setState({
        failureId:index
    })
    return
   if(index==1){
     this._doorBreak.setState({
         isChecked:true,
          // failureId:index
     })
     this._doorBreaks.setState({
           isChecked:false
       })

   }else {
        if(index==2){
           this._doorBreak.setState({
               isChecked:false
           })
           this._doorBreaks.setState({
               isChecked:true,
                // failureId:index
           })
        }

   }
   // alert(this.state.failureId)
    // this.setState({
    //     failureId:index
    // })
}
}
const styles=StyleSheet.create({
    contains:{
        flex:1
    },
    textinput:{
       width:300,
        marginTop:10
    },
    ing:{
        width:335,height:35,
        flexDirection:'row',
        marginLeft:10,
        marginTop:20
    },
    waisong:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
        width:Contants.Screen.width
    },
    waisongitem:{
        alignItems:'center',
        justifyContent:'center',

    },
    history:{
      flexDirection:"row",
      width:Contants.Screen.width,
        justifyContent:"space-around",
        marginTop:10
    },
    laji:{
        justifyContent:"flex-end",
        flexDirection:'row'
    },
    heng:{
        width:Contants.Screen.width,
        height:1,
        backgroundColor:"#C0C0C0"
    },

})