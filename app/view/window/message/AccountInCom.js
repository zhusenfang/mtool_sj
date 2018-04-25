import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    BackHandler,
    Platform
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
export default class AccountInCom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentMonth:0,
            beforMonthFee:0,
            yesterdayFee:0
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
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);
        }
        postFetch(API.Shouzi,null,(result)=>{
            // alert(JSON.stringify(result))
            if(result.status==1){
                this.setState({
                    currentMonth:result.data.currentMonthFee,
                    beforMonthFee:result.data.beforeMonthFee,
                    yesterdayFee:result.data.yesterdayFee
                })
                if(this.state.currentMonth==undefined || this.state.beforMonthFee==undefined || this.state.yesterdayFee){
                    this.setState({
                        currentMonth:0,
                        beforMonthFee:0,
                        yesterdayFee:0
                    })
                }else {
                }
            }
        })
    }
    render(){

        return(<View style={comstyle.contain}>
            <Text style={styles.yue}>月收资</Text>
            <View style={[comstyle.item,{marginTop:5}]}>
              <Text>{'  当月总计：'+this.state.currentMonth}</Text>
                <Text>次日更新</Text>
            </View>
            <View style={[comstyle.item,{marginTop:10}]}>
                <Text>{'  上一个月：'+this.state.beforMonthFee}</Text>

            </View>
            <Text style={styles.yue}>日收资</Text>
            <View style={[comstyle.item,{marginTop:5}]}>
                <Text>{'  前一天：'+this.state.yesterdayFee}</Text>

            </View>
            <View style={[comstyle.item,{marginTop:10}]}>
                <Text>当日收资明细</Text>
                <TouchableOpacity onPress={()=>{
                    // this.props.navigation.navigate('TodayDetail');
                }}>
       <Image source={require('../../../img/window/write.png')} style={[comstyle.img,{marginRight:20}]}/>
                </TouchableOpacity>
            </View>

        </View>)
    }
}
const styles=StyleSheet.create({
    yue:{
        marginTop:20,
        marginLeft:10,
        marginBottom:10
    }
})