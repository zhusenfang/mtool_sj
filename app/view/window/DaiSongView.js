import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView
} from 'react-native';
import Contants from '../../common/Contants';
import CheckBox from '../CommonPage/GGCheckView'
import {API,postFetch} from '../../common/GConst'
import Toast from "react-native-easy-toast";
export default class DaiSongView extends Component {

    render(){
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
            <Toast
                ref={(e) => {
                    this._toast = e
                }}
                position='center'
            />
        </View>)
    }
    onChangeText(text){
        this.setState({
            description:text
        })

    }
    textAction(){
        postFetch(API.Search,{
            inputSearch:this.state.description,
            orderDining:{source:0,diningType:2}
        }, (result)=> {
              // alert(JSON.stringify(result))
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
    textinput:{
        width:300,

    },
    ing:{
        width:335,height:35,
        flexDirection:'row',
        marginLeft:10,
        marginTop:20
    },
})