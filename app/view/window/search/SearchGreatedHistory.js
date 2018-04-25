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
    Platform,
    Switch,
    AsyncStorage,
    BackHandler
} from 'react-native';
import Contants from '../../../common/Contants'
import comstyle from '../../../common/CommonStyle';
import Modal from 'react-native-modal';
import Toast from "react-native-easy-toast";
import {API,postFetch} from '../../../common/GConst';
import RadioModal from 'react-native-radio-master';
import ImagePicker from 'react-native-image-picker'
import Storage from '../../../common/GGAsyncStorage'

var hotlist=[]
var pagelist=[]
export default class SearchGreatedHistory extends Component {
    constructor(props){
        super(props)
        this.state={
            hisList:[]
        }
    }
    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
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

    componentWillMount(){
        Storage.get('seargr').then((tagss)=>{
            // alert(tagss)
            this.setState({
                hisList:tagss
            })
        })
    }
    render(){
        if(this.state.hisList!=null){
            // alert('sss')
            for(var j=0;j<this.state.hisList.length;j++){
                pagelist.push(<View style={styles.bord} key={j}><Text style={styles.keyword}>{this.state.hisList[j]}</Text></View>)
            }
        }
        return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
            {/*<Text>sss</Text>*/}
            <View style={{flexDirection:"row",flexWrap:'wrap',marginLeft:20,marginRight:20,marginTop:25.5}}>
                {pagelist}
            </View>
        </View>)
    }
}
const styles=StyleSheet.create({
    bord:{
        borderRadius:4,
        borderWidth:1,
        borderColor:'#E5E5E5',
        height:30,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        marginLeft:5,marginRight:5,
        marginTop:15
    },
    keyword:{
        fontSize:12,
        color:'#B2B2B2',
        marginLeft:10,marginRight:10,

    }
})