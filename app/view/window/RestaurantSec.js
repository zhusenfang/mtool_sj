import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    AsyncStorage
} from 'react-native';
import Contants from '../../common/Contants';
import CheckBox from '../CommonPage/GGCheckView'
import {API,postFetch} from '../../common/GConst'
import Toast from "react-native-easy-toast";
import Storage from '../../common/GGAsyncStorage'
export default class RestaurantSec extends Component {
    constructor(props){
        super(props)
        this.state={
            description:'',
            tags:new Array()
        }




    }
    componentDidmount(){

    }

    render(){
        const list=this.props.navigation.state.params.title
        // alert(list)
        return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
            <Image
                source={require('../../img/window/sousuo.png')}
                style={styles.ing}
            >
                <TextInput style={styles.textinput}
                underlineColorAndroid={"transparent"}
                placeholder={"输入手机号/姓名/地址"}
                           onChangeText={this.onChangeText.bind(this)}
                />
           <TouchableOpacity  onPress={this.textAction.bind(this)}>
                <Image source={require('../../img/page/srarch.png')} style={{width:16,height:16,marginTop:5}}/>
           </TouchableOpacity>
            </Image>
            <View style={styles.waisong}>
                <View style={styles.waisongitem}>
                    <Image source={require('../../img/window/warsong.png')} style={{width:90,height:35}}>
                        <CheckBox
                            ref={(e) => this._doorBreak = e}
                            rightText={'外送订单'}
                            onClick={()=>this.checkAction(1)}
                            isChecked={list==1?true:false}
                        />
                    </Image>
                </View>
                <View style={styles.waisongitem}>
                    <Image source={require('../../img/window/warsong.png')} style={{width:90,height:35}}>
                        <CheckBox
                            ref={(e) => this._doorBreaks = e}
                            rightText={'到店订单'}
                            onClick={()=>this.checkAction(1)}
                            isChecked={list==2?true:false}
                        />
                    </Image>
                </View>
                <Toast
                    ref={(e) => {
                        this._toast = e
                    }}
                    position='top'
                />

            </View>

        </View>)
    }
    checkAction(index){

        if(index==1){
            this._doorBreak.setState({
                isChecked:true
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

            })
             }

        }

    }
    onChangeText(text){
        this.setState({
            description:text
        })

    }
    textAction(){
        var his=[this.state.description]

        var arr=new Array();
        Storage.get('search').then((tagss)=>{
            // alert("len"+tagss.toString())
            if(tagss==null){
                tagss = new Array();
            }
            tagss.push(his)
            AsyncStorage.setItem('search', JSON.stringify(tagss),);
            this.state.tags.push(his);
            // alert(tagss.toString())
        })



        const list=this.props.navigation.state.params.title
    postFetch(API.Search,{
        inputSearch:this.state.description,
        orderDining:{source:0,diningType:list==1?'0':'1'}
       }, (result)=> {
    // alert(JSON.stringify(result.data[0]))
        if(result.status==1){



            if(result.data==[] || result.data.length==0){
                // alert(JSON.stringify(result.data))
                this._toast.show('没有匹配数据')
            }else {

               this.props.navigation.navigate('SearchResult',{id:JSON.stringify(result.data)})
            }
        }
    },(error)=>{
         // alert(error)
    })

     }
}
const styles=StyleSheet.create({
    contains:{
        flex:1
    },
    textinput:{
        width:300,

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
        marginTop:20
    },
    waisongitem:{
        alignItems:'center',
        justifyContent:'center',

    }

})