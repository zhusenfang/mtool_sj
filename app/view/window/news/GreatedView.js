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
    Platform,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API,postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants'
var pagelist=[]
export default class DongTaiFirst extends Component {
    constructor(props) {
        super(props)
        const list=this.props.navigation.state.params.data;
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            // dataSource:this.state.dataSource.cloneWithRows(list)
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
        // alert(JSON.stringify(list))
        if(list!=undefined){
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(list)
            })
        }
    }
    render(){


        // alert(JSON.stringify(list))
        return(<View style={[comstyle.contain,{backgroundColor:'#f9f9f9'}]}>
            {/*<Text>ddd</Text>*/}
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRowImage}
                enableEmptySections={true}
                // horizontal={true}
                contentContainerStyle={{ flexWrap:'wrap',
                    flexDirection:'row',}}
            />
        </View>)

    }
    _renderRowImage=(rowData)=>{
        // alert(JSON.stringify(rowData))
        return(<View style={{flexDirection:'column',flexWrap:'wrap',alignItems:'center'}}>
            <Image source={{uri:rowData.picUrl}} style={{width:75,height:75,marginTop:10,marginLeft:10,marginRight:10,borderRadius:4}}/>
            <Text>{rowData.nickname}</Text>
        </View>)
    }
}